import { useState, userState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, setUpdate, remove }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const hideRemove = { display: blog.user.username !== user ? 'none' : '' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const like = async event => {
    event.preventDefault()
    const likes = blog.likes + 1
    const newBlog = { ...blog, likes }
    await blogService.update(blog.id, newBlog)
    setUpdate(Math.floor(Math.random() * 100))
  }

  return (
    <div style={blogStyle}>
      <div className='blog'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} style={hideWhenVisible}>view</button>
        <button onClick={toggleVisibility} style={showWhenVisible}>hide</button>
      </div>
      <div className='fullblog' style={showWhenVisible}>
        <a href={`${blog.url}`} >{blog.url}</a> <br/>
        likes {blog.likes}
        <button onClick={like}>like</button> <br/>
        {blog.user?.username} <br/>
        <button onClick={remove} style={hideRemove}>remove</button>
      </div>
    </div>
  )
}

export default Blog