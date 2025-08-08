const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const note = new Note({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedNote = await note.save()
  response.status(201).json(savedNote)
})

module.exports = notesRouter
