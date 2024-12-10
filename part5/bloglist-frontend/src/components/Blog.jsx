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

  return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button style={{margin: '6px'}} onClick={() => toggleShowDetails(blog.id)}>
          {showDetails ? 'hide' : 'show details'}
        </button>
        {showDetails && (
            <div>
              <p>{blog.url}</p>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <p>likes {blog.likes} </p>
                <button style={{
                  height: 'fit-content',
                  padding: '3px 5px',
                  alignItems: "center",
                  marginTop: '10px',
                  marginLeft: '6px'
                }} onClick={handleLikeBlog}>like
                </button>
              </div>
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
  marginBottom: 5
}

export default Blog