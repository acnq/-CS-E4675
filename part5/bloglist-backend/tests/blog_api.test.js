const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./tesst_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  // hanlde user schema
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  // handle blog schema
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(note => note.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs returned with right amount', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.id)
  contents.forEach(e => {
    assert.notEqual(e, null)
  })
})

test('the addition of a new blog', async () => {
  // get token
  const loginInfo = {
    username: 'root',
    password: 'sekret'
  }
  const response = await api
    .post('/api/login')
    .send(loginInfo)
  const token = 'Bearer ' + response.body.token.toString()
  console.log(token)
  const newBlog = {
    title: 'Title',
    author: 'Author',
    url: 'http://sample.com/url',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Title'))
})

test('default of likes is 0', async () => {
  // get token
  const loginInfo = {
    username: 'root',
    password: 'sekret'
  }
  const response = await api
    .post('/api/login')
    .send(loginInfo)
  const token = 'Bearer ' + response.body.token.toString()
  console.log(token)

  const newBlog = {
    title: 'Default Likes',
    author: 'Author',
    url: 'http://sample.com/url',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Default Likes'))
  blogsAtEnd.filter(b => b.title === 'Default Likes').forEach(e => {
    assert.strictEqual(e.likes, 0)
  })
})

test('Invalid token POST', async () => {

  const newBlog = {
    title: 'Default Likes',
    author: 'Author',
    url: 'http://sample.com/url',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', '')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})
test('missing author or url goes to bad request', async () => {
  // get token
  const loginInfo = {
    username: 'root',
    password: 'sekret'
  }
  const response = await api
    .post('/api/login')
    .send(loginInfo)
  const token = 'Bearer ' + response.body.token.toString()
  console.log(token)

  const newBlog = {
    title: 'Missing Author or URL',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('deletion of a blog', async () => {
  // first login
  // get token
  const loginInfo = {
    username: 'root',
    password: 'sekret'
  }
  const response = await api
    .post('/api/login')
    .send(loginInfo)
  const token = 'Bearer ' + response.body.token.toString()
  console.log(token)
  // and add a blog
  const newBlog = {
    title: 'Title2',
    author: 'Author',
    url: 'http://sample.com/url',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog)
    .expect(201)

  const blogsAtSart = await helper.blogsInDb()
  const blogsNeedToDelete = blogsAtSart.filter(b => b.title === 'Title2')
  const blogToDelete = blogsNeedToDelete[0]
  console.log(blogToDelete)

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', token)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtSart.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))
})

test('update a blog', async () => {
  const blogsAtStart = await helper.blogsInDb()
  let blogToUpdate = blogsAtStart[0]

  const newBlog = {
    ...blogToUpdate,
    title: 'updated blog',
  }
  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('updated blog'))
})

after(async () => {
  await mongoose.connection.close()
})