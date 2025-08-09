import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [important, setImportant] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    createBlog({ title, author, url, important, likes: 0 }) // добавляем likes
    setTitle('')
    setAuthor('')
    setUrl('')
    setImportant(false)
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Create new blog</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 400 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          required
        />
        <input
          placeholder="Author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          required
        />
        <input
          placeholder="URL"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          required
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={important}
            onChange={({ target }) => setImportant(target.checked)}
          />
          Mark as Important
        </label>

        <button
          type="submit"
          style={{
            padding: '10px',
            borderRadius: 4,
            border: 'none',
            backgroundColor: '#1976d2',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Create
        </button>
      </form>
    </div>
  )
}

export default BlogForm
