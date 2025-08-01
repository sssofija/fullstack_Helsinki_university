const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const notesRouter = require('./controllers/notes')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()

logger.info('Connecting to MongoDB...')
mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(error => logger.error('Error connecting to MongoDB:', error.message))

app.use(cors())
app.use(express.json())

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
