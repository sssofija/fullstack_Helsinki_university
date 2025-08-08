const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')

const api = supertest(app)

const initialNotes = [
  { title: 'First note', author: 'Author1', url: 'http://test1.com', likes: 5 },
  { title: 'Second note', author: 'Author2', url: 'http://test2.com', likes: 10 }
]

beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(initialNotes)
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid note can be added', async () => {
  const newNote = {
    title: 'Async/Await saves the day',
    author: 'Sofia',
    url: 'http://asyncawait.com',
    likes: 7
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await Note.find({})
  expect(notesAtEnd).toHaveLength(initialNotes.length + 1)

  const titles = notesAtEnd.map(n => n.title)
  expect(titles).toContain(newNote.title)
})

test('likes default to 0 if missing', async () => {
  const newNote = {
    title: 'No likes here',
    author: 'Nobody',
    url: 'http://nolikes.com'
  }

  const response = await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)

  const savedNote = await Note.findById(response.body.id)
  expect(savedNote.likes).toBe(0)
})

test('missing title and url return 400', async () => {
  const newNote = { author: 'Missing data' }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await Note.find({})
  expect(notesAtEnd).toHaveLength(initialNotes.length)
})

test('a note can be deleted', async () => {
  const notesAtStart = await Note.find({})
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await Note.find({})
  expect(notesAtEnd).toHaveLength(initialNotes.length - 1)

  const titles = notesAtEnd.map(n => n.title)
  expect(titles).not.toContain(noteToDelete.title)
})

test('a note can be updated', async () => {
  const notesAtStart = await Note.find({})
  const noteToUpdate = notesAtStart[0]

  const updatedData = { likes: noteToUpdate.likes + 1 }

  const response = await api
    .put(`/api/notes/${noteToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(noteToUpdate.likes + 1)

  const updatedNote = await Note.findById(noteToUpdate.id)
  expect(updatedNote.likes).toBe(noteToUpdate.likes + 1)
})

afterAll(async () => {
  await mongoose.connection.close()
})
