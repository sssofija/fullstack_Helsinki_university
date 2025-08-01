const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find({})
    res.json(notes)
  } catch (error) {
    next(error)
  }
})

notesRouter.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.post('/', async (req, res, next) => {
  const { content, important = false } = req.body
  const note = new Note({ content, important })

  try {
    const savedNote = await note.save()
    res.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', async (req, res, next) => {
  const { content, important } = req.body

  try {
    const note = await Note.findById(req.params.id)
    if (!note) {
      return res.status(404).end()
    }

    note.content = content
    note.important = important
    const updatedNote = await note.save()
    res.json(updatedNote)
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
