import { useState } from 'react'
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    }, setTitle, setAuthor, setUrl)
  }

  return (
    <form onSubmit={addBlog}>
      <div>
      title:
        <input
          type='text'
          value={title}
          name='Title'
          id='title'
          placeholder='title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
      author:
        <input
          type='text'
          value={author}
          name='Author'
          id='author'
          placeholder='author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
      url:
        <input
          type='text'
          value={url}
          name='Url'
          id='url'
          placeholder='url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button id='create' type='submit'>create</button>
    </form>
  )
}

export default BlogForm