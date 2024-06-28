import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogFrom from './components/BlogForm'

//"username": root,
//"password": sekret
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [update, setUpdate] = useState(null)

  // useEffects
  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs )
      console.log(update)
    })
  }, [update]) //used for keep user visibe
  // not know exactly why.
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  // helper functions_p1: about login
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setErrorMessage(null)
      setMessage(
        `loggin as ${user.username}`
      )
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const logout = () => {
    setUser(null)
    blogService.setToken('')
    window.localStorage.removeItem('loggedBlogappUser')
    setUsername('')
    setPassword('')
  }

  // helper functions_p2: about blogs
  const createBlog = (blogObject, setTitle, setAuthor, setUrl) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setErrorMessage(null)
        setMessage(
          `a new blog ${returnedBlog.title}`
        )
        console.log(message)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setBlogs(blogs.concat(returnedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
      })
      .catch(error => {
        setMessage(null)
        setErrorMessage(error.response.data.error)
        console.log(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
  const remove = async (id) => {
    const blog = blogs.find(n => n.id === id)
    console.log('id:', id, 'blog: ', blog)
    if (window.confirm(`remove blog ${blog.title} by  ${blog.author}`)) {
      console.log(user)
      blogService.setToken(user.token)
      console.log('user token: ', user.token)
      console.log('blog.id: ', blog.id)
      try {
        await blogService.remove(blog.id, user.token)
        setUpdate(Math.floor(Math.random() * 100))
      } catch (error) {
        setMessage(null)
        setErrorMessage(error.response.data.error)
        console.log(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  // pages
  const loginPage = () => (
    <div>
      <h2>log in to application</h2>
      <Notification message={message} errorMessage={errorMessage} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )

  const blogsPage = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={message} errorMessage={errorMessage} />
      <p>{user.name} logged in<button onClick={logout}>logout</button></p>
      <h2>create new</h2>
      <Togglable buttonLabel='create new blog'>
        <BlogFrom createBlog={createBlog}></BlogFrom>
      </Togglable>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} setUpdate={setUpdate} user={user.username} remove={() => remove(blog.id)}/>
      )}
    </div>
  )

  return (
    <div>
      {user === null ?
        loginPage() :
        blogsPage()
      }
    </div>
  )
}

export default App