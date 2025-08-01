require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

// Удаляем лишние кавычки из переменной окружения
let allowedOrigin = process.env.CORS_ORIGIN || '*'
allowedOrigin = allowedOrigin.replace(/^'+|'+$/g, '') // удаляет одинарные кавычки с начала и конца

console.log('CORS_ORIGIN:', allowedOrigin)

// CORS + Preflight
app.use(cors({ origin: allowedOrigin }))
app.options('*', cors({ origin: allowedOrigin })) // обрабатывает OPTIONS-запросы

morgan.token('body', req => JSON.stringify(req.body))

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res) => {
  const date = new Date().toString()
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `)
    })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  const person = new Person({ name, number })

  person.save()
    .then(saved => res.json(saved))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then(person => {
      if (!person) return res.status(404).end()
      person.name = name
      person.number = number
      return person.save().then(updated => res.json(updated))
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
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
  }
  next(error)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
