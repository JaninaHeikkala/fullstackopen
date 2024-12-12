import { useState } from 'react'
import blogService from '../services/blogs.js'

const NewBlogForm = ({
  handleAlert,
  handleRefreshChange,
  handleCreateBlog = async (blogData) => {
    const blog = await blogService.create(blogData)
    handleAlert(`a new blog ${blogData.title}, by ${blogData.author} added`, 'success')
    handleRefreshChange(true)
  },
}) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await handleCreateBlog({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      handleAlert('could not create blog', 'error')
    }
  }

  return (
    <div>
      {!newBlogFormVisible && <button style={{ marginBlock: '6px' }} onClick={() => setNewBlogFormVisible(true)}>new blog</button>}
      {newBlogFormVisible ? (
        <div>
          <h2>create new</h2>
          <form onSubmit={handleSubmit}>
            <div>
              title:
              <input
                type="text"
                value={title}
                name="Title"
                onChange={({ target }) => setTitle(target.value)}
                placeholder='title'
              />
            </div>
            <div>
              author:
              <input
                type="text"
                value={author}
                name="Author"
                onChange={({ target }) => setAuthor(target.value)}
                placeholder='author'
              />
            </div>
            <div>
              url:
              <input
                type="text"
                value={url}
                name="Url"
                onChange={({ target }) => setUrl(target.value)}
                placeholder='url'
              />
            </div>
            <button type="submit">create</button>
          </form>
          <button onClick={() => setNewBlogFormVisible(false)}>cancel</button>
        </div>
      ) : null}
    </div>
  )
}

export default NewBlogForm