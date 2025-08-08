require('dotenv').config({ path: '.env.test' }) // загрузка тестовых переменных окружения

const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Note = require('../models/note')
const User = require('../models/user')
const config = require('../utils/config')

const api = supertest(app)

let token = null

const initialNotes = [
  { title: 'First note', author: 'Author1', url: 'http://test1.com', likes: 5 },
  { title: 'Second note', author: 'Author2', url: 'http://test2.com', likes: 10 }
]

beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI)
  await User.deleteMany({})
  await Note.deleteMany({})
})

beforeEach(async () => {
  await User.deleteMany({})
  await Note.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const notesWithUser = initialNotes.map(note => ({ ...note, user: user._id }))
  await Note.insertMany(notesWithUser)

  // Получаем токен через логин API, чтобы использовать правильный секрет и процесс авторизации
  const response = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  token = response.body.token
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid note can be added with token', async () => {
  const newNote = {
    title: 'Async/Await saves the day',
    author: 'Sofia',
    url: 'http://asyncawait.com',
    likes: 7
  }

  await api
    .post('/api/notes')
    .set('Authorization', `Bearer ${token}`)
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await Note.find({})
  expect(notesAtEnd).toHaveLength(initialNotes.length + 1)

  const titles = notesAtEnd.map(n => n.title)
  expect(titles).toContain(newNote.title)
})

test('creation fails without token', async () => {
  const newNote = {
    title: 'No token note',
    author: 'Anon',
    url: 'http://notoken.com',
    likes: 3
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(401)

  const notesAtEnd = await Note.find({})
  expect(notesAtEnd).toHaveLength(initialNotes.length)
})

test('likes default to 0 if missing', async () => {
  const newNote = {
    title: 'No likes here',
    author: 'Nobody',
    url: 'http://nolikes.com'
  }

  const response = await api
    .post('/api/notes')
    .set('Authorization', `Bearer ${token}`)
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)

  const savedNote = await Note.findById(response.body._id)
  expect(savedNote.likes).toBe(0)
})

test('missing title and url return 400', async () => {
  const newNote = { author: 'Missing data' }

  await api
    .post('/api/notes')
    .set('Authorization', `Bearer ${token}`)
    .send(newNote)
    .expect(400)

  const notesAtEnd = await Note.find({})
  expect(notesAtEnd).toHaveLength(initialNotes.length)
})

test('a note can be deleted with token', async () => {
  const notesAtStart = await Note.find({})
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete._id.toString()}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const notesAtEnd = await Note.find({})
  expect(notesAtEnd).toHaveLength(initialNotes.length - 1)

  const titles = notesAtEnd.map(n => n.title)
  expect(titles).not.toContain(noteToDelete.title)
})

test('deletion fails without token', async () => {
  const notesAtStart = await Note.find({})
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete._id.toString()}`)
    .expect(401)

  const notesAtEnd = await Note.find({})
  expect(notesAtEnd).toHaveLength(initialNotes.length)
})

test('a note can be updated', async () => {
  const notesAtStart = await Note.find({})
  const noteToUpdate = notesAtStart[0]

  const updatedData = { likes: noteToUpdate.likes + 1 }

  const response = await api
    .put(`/api/notes/${noteToUpdate._id.toString()}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(noteToUpdate.likes + 1)

  const updatedNote = await Note.findById(noteToUpdate._id)
  expect(updatedNote.likes).toBe(noteToUpdate.likes + 1)
})

afterAll(async () => {
  await User.deleteMany({})
  await Note.deleteMany({})
  await mongoose.connection.close()
})
