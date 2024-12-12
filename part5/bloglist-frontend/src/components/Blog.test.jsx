import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'

test('renders content', async () => {

  const blog = {
    title: 'testTitle1',
    author: 'testAuthor1',
    url: 'testUrl1',
    likes: 0,
    user: 'testUser1',
  }

  const { container } = render(<Blog blog={blog}/>)

  const headerElement = container.querySelector('.blog-header')
  expect(headerElement).toHaveTextContent('testTitle1')
  expect(headerElement).toHaveTextContent('testAuthor1')

  const detailsElement = container.querySelector('.blog-details')
  expect(detailsElement).toBeNull()

  expect(container.querySelector('.blog-url')).toBeNull()
  expect(container.querySelector('.blog-likes')).toBeNull()

})

test('details click', async () => {
  const user = userEvent.setup()

  const blog = {
    title: 'testTitle1',
    author: 'testAuthor1',
    url: 'testUrl1',
    likes: 0,
    user: 'testUser1',
  }

  const { container } = render(<Blog blog={blog}/>)

  const button = screen.getByText('show details')
  await user.click(button)

  const detailsElement = container.querySelector('.blog-details')
  expect(detailsElement).toHaveTextContent('testUrl1')
  expect(detailsElement).toHaveTextContent('likes 0')

  expect(container.querySelector('.blog-url')).not.toBeNull()
  expect(container.querySelector('.blog-likes')).not.toBeNull()

})