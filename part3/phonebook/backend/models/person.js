const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

if (!url) {
  console.error('Error: MONGODB_URI is not defined')
  process.exit(1)
}

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.error('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: v => /^\d{2,3}-\d+$/.test(v),
      message: () =>
        'The phone number must be at least 8 characters long and contain a hyphen after the second or third digit (e.g., 040-6655678).'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
