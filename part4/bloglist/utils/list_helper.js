const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((fav, blog) => (blog.likes > fav.likes ? blog : fav), blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}

  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  }

  const topAuthor = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  )

  return {
    author: topAuthor,
    blogs: counts[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likes = {}

  for (const blog of blogs) {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
  }

  const topAuthor = Object.keys(likes).reduce((a, b) =>
    likes[a] > likes[b] ? a : b
  )

  return {
    author: topAuthor,
    likes: likes[topAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
