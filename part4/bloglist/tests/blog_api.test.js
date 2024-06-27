const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./tesst_helper')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
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
  const newBlog = {
    title: 'Title',
    author: 'Author',
    url: 'http://sample.com/url',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Title'))
})

test('default of likes is 0', async () => {
  const newBlog = {
    title: 'Default Likes',
    author: 'Author',
    url: 'http://sample.com/url',
  }

  await api
    .post('/api/blogs')
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

test('missing author or url goes to bad request', async () => {
  const newBlog = {
    title: 'Missing Author or URL',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})