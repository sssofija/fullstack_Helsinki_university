const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const testUser = {
  name: 'Test User',
  username: 'testuser',
  password: 'password123'
}

let token
let userId

describe('when there are initially some blogs saved', () => {
  beforeAll(async () => {
    await User.deleteMany({})
    let response = await api.post('/api/users').send(testUser)
    userId = response.body.id

    response = await api.post('/api/login').send(testUser)
    token = response.body.token
  })

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(
      helper.initialBlogs.map(blog => ({ ...blog, user: userId }))
    )
  })

  test('right amount of blogs are returned', async () => {
    const result = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toHaveLength(helper.initialBlogs.length)
  })

  test('blogs have id attribute', async () => {
    const blogs = await helper.blogsInDb()
    blogs.forEach(blog => expect(blog.id).toBeDefined())
  })

  describe('when adding a new blog', () => {
    test('blog count increases by one and added blog can be found', async () => {
      const newBlog = {
        title: 'Testing Blog API',
        author: 'Mark Markkanen',
        url: 'https://testurl.com/',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).toContain('Testing Blog API')
    })

    test('likes attribute defaults to 0 if missing', async () => {
      const newBlog = {
        title: 'Testing Blog API',
        author: 'Mark Markkanen',
        url: 'https://testurl.com/'
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(blog => blog.title === 'Testing Blog API')

      expect(addedBlog.likes).toBe(0)
    })

    test('adding blog without token fails with 401', async () => {
      const newBlog = {
        title: 'Testing Blog API',
        author: 'Mark Markkanen',
        url: 'https://testurl.com/',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).not.toContain('Testing Blog API')
    })

    test('posting blog without title returns 400', async () => {
      const newBlog = {
        author: 'Mark Markkanen',
        url: 'https://testurl.com/',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })

    test('posting blog without url returns 400', async () => {
      const newBlog = {
        title: 'Testing Blog API',
        author: 'Mark Markkanen',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map(b => b.title)

      expect(titles).not.toContain(blogToDelete.title)
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
    })
  })

  describe('modification of a blog', () => {
    test('all fields are updated', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const editedBlog = {
        title: 'Updated Title',
        author: 'Updated Author',
        url: 'Updated url',
        likes: blogToUpdate.likes + 1
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editedBlog)
        .expect(200)

      const updatedBlog = await Blog.findById(blogToUpdate.id)

      expect(updatedBlog.title).toBe(editedBlog.title)
      expect(updatedBlog.author).toBe(editedBlog.author)
      expect(updatedBlog.url).toBe(editedBlog.url)
      expect(updatedBlog.likes).toBe(editedBlog.likes)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
