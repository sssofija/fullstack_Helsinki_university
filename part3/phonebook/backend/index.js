require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

const allowedOrigins = [process.env.CORS_ORIGIN]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  }
}))

app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments({})
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (person) res.json(person)
    else res.status(404).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (req, res, next) => {
  try {
    const { name, number } = req.body
    const person = new Person({ name, number })
    const saved = await person.save()
    res.json(saved)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (req, res, next) => {
  try {
    const { name, number } = req.body
    const updated = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
    res.json(updated)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

app.use((error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.message && error.message.includes('CORS')) {
    return res.status(401).json({ error: error.message })
  }
  next(error)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
