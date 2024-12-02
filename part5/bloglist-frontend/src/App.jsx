import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
    setRefresh(false)
  }, [refresh])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      const blog = await blogService.create({
        title,
        author,
        url
      })
      setTitle('')
      setAuthor('')
      setUrl('')
      setRefresh(true)
    } catch (exception) {
      setErrorMessage("could not create blog")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      setUser(null)
      window.localStorage.removeItem('loggedBlogappUser')
    } catch (exception) {
      setErrorMessage('Could not log out')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const createNewForm = () => (
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
              type="text"
              value={title}
              name="Title"
              onChange={({target}) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
              type="text"
              value={author}
              name="Author"
              onChange={({target}) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
              type="text"
              value={url}
              name="Url"
              onChange={({target}) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
  )

  return (
      <div>
      {user === null ? (loginForm()) : (
            <div>
              <h2>blogs</h2>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <p>{`logged in as ${user.username}`}</p>
            <button style={{height: 'fit-content', padding: '3px 5px'}} onClick={handleLogout}>logout</button>
          </div>
          <h2>create new</h2>
          {createNewForm()}
          {blogs.map(blog =>
              <Blog key={blog.id} blog={blog}/>
          )}
        </div>
      )}
    </div>
  )
}

export default App