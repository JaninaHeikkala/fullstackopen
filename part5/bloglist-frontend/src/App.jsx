import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Alert from "./components/Alert.jsx";
import NewBlogForm from "./components/NewBlogForm.jsx";

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
  const [newBlogFormVisible, setNewBlogFormVisible] = useState(false)

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
      setNewBlogFormVisible(false)
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
                  <button onClick={() => setNewBlogFormVisible(true)}>new blog</button>
                  {newBlogFormVisible && (
                      <div>
                          <NewBlogForm
                              handleCreateNewBlog={handleCreateBlog}
                              title={title}
                              author={author}
                              url={url}
                              handleTitleChange={({target}) => setTitle(target.value)}
                              handleAuthorChange={({target}) => setAuthor(target.value)}
                              handleUrlChange={({target}) => setUrl(target.value)}
                          />
                          <button onClick={() => setNewBlogFormVisible(false)}>cancel</button>
                      </div>
                  )}
                  {blogs.map(blog =>
                      <Blog key={blog.id} blog={blog}/>
                  )}
              </div>
          )}
      </div>
  )
}

export default App