import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showMessage(`Welcome ${user.name}`, 'success')
    } catch (exception) {
      showMessage('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showMessage(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`, 'success')
    } catch (error) {
      showMessage('Error adding blog', 'error')
    }
  }

  const showMessage = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

  if (user === null) {
    return (
      <div style={{ maxWidth: 300, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Login to application</h2>
        <Notification message={message} type={messageType} />
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>
            <span style={{ display: 'block', marginBottom: 4 }}>Username</span>
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: 4 }}>Password</span>
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </label>
          <button
            type="submit"
            style={{
              padding: '10px 0',
              borderRadius: 4,
              border: 'none',
              backgroundColor: '#1976d2',
              color: 'white',
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 600, margin: '30px auto', padding: 20 }}>
      <h2>blogs</h2>
      <Notification message={message} type={messageType} />
      <p>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </p>
      <BlogForm createBlog={addBlog} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
