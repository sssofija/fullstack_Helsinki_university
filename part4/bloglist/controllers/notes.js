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

notesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id  // <-- добавил получение id
  await Note.findByIdAndDelete(id)
  response.status(204).end()
})

notesRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { likes: body.likes || 0 },
    { new: true, runValidators: true, context: 'query' }
  )

  if (updatedNote) {
    response.json(updatedNote)
  } else {
    response.status(404).end()
  }
})

module.exports = notesRouter
