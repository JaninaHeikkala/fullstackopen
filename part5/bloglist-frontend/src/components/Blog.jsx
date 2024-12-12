import blogService from '../services/blogs.js'
import { useState } from 'react'

const Blog = ({ blog, handleRefreshChange, handleAlert, handleLikeBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleDeleteBlog = async (event) => {
    event.preventDefault()
    try {
      if (window.confirm(`delete blog ${blog.title}?`)) {
        const deletedBlog = await blogService.remove(blog.id)
        handleRefreshChange(true)
      }
    } catch (exception) {
      handleAlert(`could not delete blog, error: ${exception}`, 'error')
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div className='blog-header'>
        {blog.title} {blog.author}
        <button style={{ margin: '6px' }} onClick={() => toggleShowDetails(blog.id)}>
          {showDetails ? 'hide' : 'show details'}
        </button>
      </div>
      {showDetails && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', marginBottom: '10px' }} className='blog-details'>
          <div className='blog-url'>
            {blog.url}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', marginBlock: '6px' }} className='blog-likes'>
            likes {blog.likes}
            <button style={{
              height: 'fit-content',
              alignItems: 'center',
              marginLeft: '6px'
            }} onClick={(event) => handleLikeBlog(event, blog)}>like
            </button>
          </div>
          {user?.username}
          {blog && user && (blog?.user?.username === user?.username) ? (
            <button style={{
              height: 'fit-content',
              alignItems: 'center',
              marginLeft: '6px',
              maxWidth: 'fit-content',
            }} onClick={handleDeleteBlog}>remove blog
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 8,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

export default Blog