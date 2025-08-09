import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import '../styles/App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')
  const [registerMode, setRegisterMode] = useState(false)
  const [showImportantOnly, setShowImportantOnly] = useState(false)

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

  const showMessage = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }

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
    } catch {
      showMessage('Wrong username or password', 'error')
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    try {
      await userService.create({ username, name, password })
      showMessage(`User ${username} registered successfully! Please log in.`, 'success')
      setRegisterMode(false)
      setUsername('')
      setName('')
      setPassword('')
    } catch {
      showMessage('Error registering user', 'error')
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
    } catch {
      showMessage('Error adding blog', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        showMessage('Blog deleted successfully', 'success')
      } catch {
        showMessage('Error deleting blog', 'error')
      }
    }
  }

  const handleUpdate = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => (blog.id === id ? returnedBlog : blog)))
      showMessage(`Blog "${returnedBlog.title}" updated`, 'success')
    } catch {
      showMessage('Error updating blog', 'error')
    }
  }

  const toggleImportant = async (id) => {
    const blog = blogs.find(b => b.id === id)
    if (!blog) return

    const updatedBlog = { ...blog, important: !blog.important }
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(b => (b.id === id ? returnedBlog : b)))
      showMessage(
        `Blog "${returnedBlog.title}" marked as ${returnedBlog.important ? 'important' : 'not important'}`,
        'success'
      )
    } catch {
      showMessage('Error updating blog importance', 'error')
    }
  }

  if (user === null) {
    return (
      <div className="auth-box">
        <h2 className="auth-title">
          {registerMode ? 'Register' : 'Login to application'}
        </h2>
        <Notification message={message} type={messageType} />

        {registerMode ? (
          <form onSubmit={handleRegister} className="auth-form">
            <label className="auth-label">
              <span>Username</span>
              <input
                className="auth-input"
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                required
              />
            </label>
            <label className="auth-label">
              <span>Name</span>
              <input
                className="auth-input"
                type="text"
                value={name}
                onChange={({ target }) => setName(target.value)}
                required
              />
            </label>
            <label className="auth-label">
              <span>Password</span>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                required
              />
            </label>
            <button type="submit" className="auth-button">Register</button>
            <button type="button" onClick={() => setRegisterMode(false)} className="secondary-button">
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="auth-form">
            <label className="auth-label">
              <span>Username</span>
              <input
                className="auth-input"
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                required
              />
            </label>
            <label className="auth-label">
              <span>Password</span>
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                required
              />
            </label>
            <button type="submit" className="auth-button">Login</button>
            <button type="button" onClick={() => setRegisterMode(true)} className="secondary-button">
              Register new user
            </button>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="header fixed-header">
        <h1 className="header-title">blogs</h1>
        <div className="user-info">
          <span>{user.name} logged in</span>
          <button onClick={handleLogout} className="logout-button">logout</button>
        </div>
      </header>

      <main className="content">
        <Notification message={message} type={messageType} />
        <BlogForm createBlog={addBlog} />
        <button
          onClick={() => setShowImportantOnly(!showImportantOnly)}
          style={{
            marginBottom: 15,
            padding: '8px 12px',
            borderRadius: 4,
            border: '1px solid #1976d2',
            backgroundColor: showImportantOnly ? '#1976d2' : 'white',
            color: showImportantOnly ? 'white' : '#1976d2',
            cursor: 'pointer'
          }}
        >
          {showImportantOnly ? 'Show All' : 'Show Important'}
        </button>

        {(showImportantOnly ? blogs.filter(b => b.important) : blogs).map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onToggleImportant={toggleImportant}
          />
        )}
      </main>
    </div>
  )
}

export default App
