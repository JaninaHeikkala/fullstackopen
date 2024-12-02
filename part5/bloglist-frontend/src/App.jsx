import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Alert from "./components/Alert.jsx";

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
  const [alertType, setAlertType] = useState('')
  const [showAlert, setShowAlert] = useState(false)

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

  const handleAlert = (message, alertType) => {
    setAlertType(alertType);
    setErrorMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setErrorMessage('');
    }, 4000);
  };

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
      handleAlert('wrong username or password', 'error')
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
      handleAlert(`a new blog ${title}, by ${author} added`, 'success')
      setTitle('')
      setAuthor('')
      setUrl('')
      setRefresh(true)
    } catch (exception) {
      handleAlert('could not create blog', 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      setUser(null)
      window.localStorage.removeItem('loggedBlogappUser')
    } catch (exception) {
      handleAlert('could not log out', 'error')
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
      <Alert message={errorMessage} type={alertType} showAlert={showAlert}/>
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