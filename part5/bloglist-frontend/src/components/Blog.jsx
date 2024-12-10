import blogService from "../services/blogs.js";
import {useState} from "react";

const Blog = ({ blog, handleRefreshChange, handleAlert, user }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  }

  const handleLikeBlog = async (event) => {
    event.preventDefault()
    try {
      const updatedBlog = await blogService.update({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes += 1,
        user: user.id,
      }, blog.id)
      handleRefreshChange(true)
    } catch (exception) {
      handleAlert(`could not like blog, error: ${exception}`, 'error')
    }
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
      <div style={blogStyle}>
        {blog.title}
        <button style={{margin: '6px'}} onClick={() => toggleShowDetails(blog.id)}>
          {showDetails ? 'hide' : 'show details'}
        </button>
        {showDetails && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '0px', marginBottom: '10px'}}>
              {blog.url}
              <div style={{display: 'flex', flexDirection: 'row', marginBlock: '6px'}}>
                likes {blog.likes}
                <button style={{
                  height: 'fit-content',
                  alignItems: "center",
                  marginLeft: '6px'
                }} onClick={handleLikeBlog}>like
                </button>
              </div>
              {blog.author}
              {blog && user && (blog?.user?.username === user?.username) ? (
                  <button style={{
                    height: 'fit-content',
                    alignItems: "center",
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