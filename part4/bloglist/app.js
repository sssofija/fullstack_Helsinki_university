const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const notesRouter = require('./controllers/notes')

const app = express()

logger.info('Connecting to MongoDB...')
mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(error => logger.error('Error connecting to MongoDB:', error.message))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
