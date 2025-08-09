import { useState } from 'react'

const Blog = ({ blog, user, onDelete, onUpdate, onToggleImportant }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(blog.title)
  const [author, setAuthor] = useState(blog.author)
  const [url, setUrl] = useState(blog.url)

  const blogStyle = {
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: blog.important ? '#ffd6d6' : '#f9f9f9' // выделение для важных
  }

  const handleSave = () => {
    onUpdate(blog.id, { title, author, url, important: blog.important })
    setIsEditing(false)
  }

  return (
    <div style={blogStyle}>
      {isEditing ? (
        <>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ marginBottom: 5, width: '100%' }}
          />
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            style={{ marginBottom: 5, width: '100%' }}
          />
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            style={{ marginBottom: 5, width: '100%' }}
          />
          <button onClick={handleSave} style={{ marginRight: 8 }}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <strong>{blog.title}</strong> by {blog.author}
          <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
          {user && user.username === blog.user?.username && (
            <div style={{ marginTop: 8 }}>
              <button onClick={() => onToggleImportant(blog.id)} style={{ marginRight: 8 }}>
                {blog.important ? 'Unmark Important' : 'Mark Important'}
              </button>
              <button onClick={() => setIsEditing(true)} style={{ marginRight: 8 }}>Edit</button>
              <button onClick={() => onDelete(blog.id)} style={{ color: 'red' }}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Blog
