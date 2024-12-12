import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'

test('renders content', async () => {
  const user = userEvent.setup()

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