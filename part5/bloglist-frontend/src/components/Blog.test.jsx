import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog.jsx'
import NewBlogForm from "./NewBlogForm.jsx";

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

test('like twice', async () => {
  const user = userEvent.setup()
  const mockLikeHandler = vi.fn()

  const blog = {
    title: 'testTitle1',
    author: 'testAuthor1',
    url: 'testUrl1',
    likes: 0,
    user: 'testUser1',
  }

  const { container } = render(<Blog blog={blog} handleLikeBlog={mockLikeHandler}/>)

  const button = screen.getByText('show details')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikeHandler.mock.calls).toHaveLength(2)

})

test('new blog form', async () => {
  const user = userEvent.setup()
  const mockHandleCreateBlog = vi.fn()

  const blog = {
    title: 'testTitle1',
    author: 'testAuthor1',
    url: 'testUrl1',
    likes: 0,
    user: 'testUser1',
  }

  const { container } = render(<NewBlogForm handleCreateBlog={mockHandleCreateBlog} />)

  const newBlogButton = screen.getByText('new blog')
  await user.click(newBlogButton)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')

  const createButton = screen.getByText('create')

  await userEvent.type(titleInput, 'testing a title...');
  await userEvent.type(authorInput, 'testing an author...');
  await userEvent.type(urlInput, 'testing a url...');

  await userEvent.click(createButton)

  expect(mockHandleCreateBlog).toHaveBeenCalledTimes(1)
  expect(mockHandleCreateBlog).toHaveBeenCalledWith({
    title: 'testing a title...',
    author: 'testing an author...',
    url: 'testing a url...',
  })

})