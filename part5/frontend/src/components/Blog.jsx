import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, onDelete, onUpdate, onToggleImportant }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [title, setTitle] = useState(blog.title)
  const [author, setAuthor] = useState(blog.author)
  const [url, setUrl] = useState(blog.url)
  const [likes, setLikes] = useState(blog.likes || 0)

  const blogStyle = {
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: blog.important ? '#ffd6d6' : '#f9f9f9'
  }

  const handleSave = () => {
    onUpdate(blog.id, { title, author, url, likes, important: blog.important })
    setIsEditing(false)
  }

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleLike = () => {
    const newLikes = likes + 1
    setLikes(newLikes)
    onUpdate(blog.id, { title, author, url, likes: newLikes, important: blog.important })
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
          <div>
            <strong>{blog.title}</strong> by {blog.author}{' '}
            <button onClick={toggleDetails} style={{ marginLeft: 8 }}>
              {detailsVisible ? 'Hide' : 'View'}
            </button>
          </div>

          {detailsVisible && (
            <div style={{ marginTop: 8 }}>
              <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
              <div>
                Likes: {likes}{' '}
                <button onClick={handleLike} style={{ marginLeft: 8 }}>Like</button>
              </div>
              <div>Added by: {blog.user?.name || 'Unknown'}</div>
            </div>
          )}

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

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number,
    important: PropTypes.bool,
    user: PropTypes.shape({
      username: PropTypes.string,
      name: PropTypes.string,
      id: PropTypes.string
    }),
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired
  }),
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onToggleImportant: PropTypes.func.isRequired
}

export default Blog
