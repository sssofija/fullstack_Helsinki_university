require('dotenv').config({ path: '.env.test' })

const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const User = require('../models/user')
const config = require('../utils/config')

const api = supertest(app)

let token = null

// Генерация случайного username для тестов
function randomUsername() {
  return 'user_' + Math.random().toString(36).substring(2, 10)
}

beforeAll(async () => {
  // Подключаемся к тестовой БД
  await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  // Очищаем коллекцию пользователей перед каждым тестом
  await User.deleteMany({})

  // Создаем пользователя root
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  await user.save()

  // Генерируем JWT токен для аутентификации
  const userForToken = {
    username: user.username,
    id: user._id.toString(),
  }
  token = jwt.sign(userForToken, config.SECRET, { expiresIn: '1h' })
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: randomUsername(),
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  await api
    .post('/api/users')
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)
  expect(usernames).toContain(newUser.username)
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'root',
    name: 'Superuser2',
    password: 'anotherpassword',
  }

  const result = await api
    .post('/api/users')
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error.toLowerCase()).toContain('username must be unique')

  const usersAtEnd = await User.find({})
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

test('creation fails if username is too short', async () => {
  const newUser = {
    username: 'ab',
    name: 'Too short',
    password: 'validpass',
  }

  const result = await api
    .post('/api/users')
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .expect(400)

  expect(result.body.error.toLowerCase()).toContain('username must be at least 3 characters long')
})

test('creation fails if password is too short', async () => {
  const newUser = {
    username: 'validuser',
    name: 'Short password',
    password: 'pw',
  }

  const result = await api
    .post('/api/users')
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .expect(400)

  expect(result.body.error.toLowerCase()).toContain('password must be at least 3 characters')
})

afterAll(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
