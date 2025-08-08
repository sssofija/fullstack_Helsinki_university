const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const note = new Note({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedNote = await note.save()

  // Добавляем id заметки в список заметок пользователя
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const note = await Note.findById(request.params.id)

  if (!note) {
    return response.status(404).json({ error: 'note not found' })
  }

  if (!user || note.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete the note' })
  }

  await Note.findByIdAndRemove(request.params.id)
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
