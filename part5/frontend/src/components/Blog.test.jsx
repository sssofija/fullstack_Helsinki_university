import React from 'react'
import '@testing-library/jest-dom'  // <-- добавь сюда
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  id: '123',
  title: 'Test Title',
  author: 'Test Author',
  url: 'http://testurl.com',
  likes: 5,
  important: false,
  user: {
    username: 'user1',
    name: 'User One',
    id: 'u1'
  }
}

const currentUser = { username: 'user1' }
const noop = () => {}

test('renders title and author, but not url or likes by default', () => {
  render(<Blog blog={blog} user={currentUser} onDelete={noop} onUpdate={noop} onToggleImportant={noop} />)

  expect(screen.getByText('Test Title')).toBeInTheDocument()
  expect(screen.getByText(/Test Author/)).toBeInTheDocument()

  expect(screen.queryByText('http://testurl.com')).not.toBeInTheDocument()
  expect(screen.queryByText(/Likes:/i)).not.toBeInTheDocument()
})

test('shows url and likes when the view button is clicked', async () => {
  const user = userEvent.setup()
  render(<Blog blog={blog} user={currentUser} onDelete={noop} onUpdate={noop} onToggleImportant={noop} />)

  const button = screen.getByText('View')
  await user.click(button)

  expect(screen.getByText('http://testurl.com')).toBeInTheDocument()
  expect(screen.getByText(/Likes: 5/i)).toBeInTheDocument()
})

test('if like button is clicked twice, event handler is called twice', async () => {
  const user = userEvent.setup()
  const mockUpdate = jest.fn()

  render(<Blog blog={blog} user={currentUser} onDelete={noop} onUpdate={mockUpdate} onToggleImportant={noop} />)

  const viewButton = screen.getByText('View')
  await user.click(viewButton)

  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockUpdate).toHaveBeenCalledTimes(2)
})
