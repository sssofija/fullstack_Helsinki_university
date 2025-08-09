const Blog = ({ blog }) => {
  const blogStyle = {
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    cursor: 'pointer'
  }

  return (
    <div style={blogStyle}>
      <strong>{blog.title}</strong> by {blog.author}
    </div>
  )
}

export default Blog
