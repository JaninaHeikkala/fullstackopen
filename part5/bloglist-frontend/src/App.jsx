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

  const [refresh, setRefresh] = useState(false)
  const [alertType, setAlertType] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    blogService.getAll().then(fetchedBlogs => {
      const blogsWithDetails = fetchedBlogs.map(blog => ({
        ...blog,
        showDetails: false,
      }));
      setBlogs(blogsWithDetails);
    });
    console.log(blogs)
    setRefresh(false);
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

  const toggleShowDetails = (id) => {
    setBlogs(blogs.map(blog =>
        blog.id === id ? { ...blog, showDetails: !blog.showDetails } : blog
    ));
  };

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
                  <div>
                      <NewBlogForm
                          handleAlert={handleAlert}
                          handleRefreshChange={setRefresh}
                      />
                  </div>
                  {blogs.map(blog =>
                      <Blog key={blog.id} blog={blog} toggleShowDetails={toggleShowDetails}/>
                  )}
              </div>
          )}
      </div>
  )
}

export default App