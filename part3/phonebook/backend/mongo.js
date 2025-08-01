//import url from './renameMongo'

const mongoose = require('mongoose')
const Person = require('./models/person')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://sofiiapiepponen:${password}@cluster0.qy68xqk.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name, number })

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to noteApp phonebook`)
    mongoose.connection.close()
  })

} else if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })

} else {
  console.log('Invalid number of arguments. Usage:')
  console.log('  node mongo.js <password>                 // to list entries')
  console.log('  node mongo.js <password> <name> <number> // to add entry')
  mongoose.connection.close()
}
