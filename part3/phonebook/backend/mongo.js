//import url from './renameMongo'
const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Wrong amount of arguments')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://sofiiapiepponen:${password}@cluster0.qy68xqk.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    if (process.argv.length === 3) {
      console.log('phonebook:')
      return Person.find({})
    } else if (process.argv.length === 5) {
      const name = process.argv[3]
      const number = process.argv[4]
      const person = new Person({ name, number })
      return person.save()
    }
  })
  .then((result) => {
    if (process.argv.length === 3) {
      result.forEach(person => console.log(person.name, person.number))
    } else if (process.argv.length === 5) {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
    }
  })
  .catch((error) => {
    console.error('Error:', error.message)
  })
  .finally(() => {
    mongoose.connection.close()
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)
