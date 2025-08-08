/*const { describe, test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe.skip('total likes', () => {
  const listWithOneBlog = [
    {
      _id: 'abc123',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://dijkstra.com',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('total likes of many blogs', () => {
    const blogs = [
      { title: 'A', author: 'X', likes: 2 },
      { title: 'B', author: 'Y', likes: 3 },
      { title: 'C', author: 'Z', likes: 5 }
    ]
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 10)
  })
})

describe.skip('favorite blog', () => {
  const blogs = [
    { title: 'Blog A', author: 'A', likes: 3 },
    { title: 'Blog B', author: 'B', likes: 7 },
    { title: 'Blog C', author: 'C', likes: 4 }
  ]

  test('returns blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[1])
  })
})

describe.skip('most blogs', () => {
  const blogs = [
    { author: 'Alice', likes: 3 },
    { author: 'Bob', likes: 5 },
    { author: 'Bob', likes: 8 },
    { author: 'Alice', likes: 1 },
    { author: 'Bob', likes: 2 }
  ]

  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, { author: 'Bob', blogs: 3 })
  })
})

describe.skip('most likes', () => {
  const blogs = [
    { author: 'Alice', likes: 3 },
    { author: 'Bob', likes: 5 },
    { author: 'Bob', likes: 8 },
    { author: 'Alice', likes: 1 },
    { author: 'Bob', likes: 2 }
  ]

  test('returns author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: 'Bob', likes: 15 })
  })
})*/

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe.skip('total likes', () => {
  const listWithOneBlog = [
    {
      _id: 'abc123',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://dijkstra.com',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('total likes of many blogs', () => {
    const blogs = [
      { title: 'A', author: 'X', likes: 2 },
      { title: 'B', author: 'Y', likes: 3 },
      { title: 'C', author: 'Z', likes: 5 }
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(10)
  })
})

describe.skip('favorite blog', () => {
  const blogs = [
    { title: 'Blog A', author: 'A', likes: 3 },
    { title: 'Blog B', author: 'B', likes: 7 },
    { title: 'Blog C', author: 'C', likes: 4 }
  ]

  test('returns blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(blogs[1])
  })
})

describe.skip('most blogs', () => {
  const blogs = [
    { author: 'Alice', likes: 3 },
    { author: 'Bob', likes: 5 },
    { author: 'Bob', likes: 8 },
    { author: 'Alice', likes: 1 },
    { author: 'Bob', likes: 2 }
  ]

  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: 'Bob', blogs: 3 })
  })
})

describe.skip('most likes', () => {
  const blogs = [
    { author: 'Alice', likes: 3 },
    { author: 'Bob', likes: 5 },
    { author: 'Bob', likes: 8 },
    { author: 'Alice', likes: 1 },
    { author: 'Bob', likes: 2 }
  ]

  test('returns author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({ author: 'Bob', likes: 15 })
  })
})
