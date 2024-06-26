const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length !== 0) {
    const mostLikes = blogs.reduce((max, blog) => {
      return max.likes > blog.likes ? max : blog
    })

    return {
      title: mostLikes.title,
      author: mostLikes.author,
      likes: mostLikes.likes
    }
  } else {
    return null
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authors = blogs.map(blog => blog.author)
  const uniqAuthors = [...new Set(authors)]

  const authorBlogs = uniqAuthors.map(author => {
    return {
      author: author,
      blogs: blogs.filter(blog => blog.author === author).length,
    }
  })

  return authorBlogs.reduce((max, author) => {
    return max.blogs > author.blogs ? max : author
  })
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authors = blogs.map(blog => blog.author)
  const uniqAuthors = [...new Set(authors)]

  const authorLikes = uniqAuthors.map(author => {
    return {
      author: author,
      likes: blogs.filter(blog => blog.author === author).reduce((sum, blog) => sum + blog.likes, 0),
    }
  })

  return authorLikes.reduce((max, author) => {
    return max.likes > author.likes ? max : author
  })

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}