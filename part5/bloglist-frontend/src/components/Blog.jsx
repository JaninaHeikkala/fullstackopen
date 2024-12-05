const Blog = ({ blog, toggleShowDetails }) => (
  <div style={blogStyle}>
    {blog.title} {blog.author}
    <button style={{ margin: '6px' }} onClick={() => toggleShowDetails(blog.id)}>
      {blog.showDetails ? 'hide' : 'show details'}
    </button>
    {blog.showDetails && (
        <div>
          <p>{blog.url}</p>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <p>likes {blog.likes} </p><button style={{height: 'fit-content', padding: '3px 5px', alignItems: "center", marginTop: '10px', marginLeft: '6px'}} >like</button>
          </div>
        </div>
    )}
  </div>  
)

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 8,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

export default Blog