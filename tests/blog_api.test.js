const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('correct amount of blogs are returned as json', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
  expect()

})

test('id property is defined', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body.map(blog => blog.id)).toBeDefined()
})

describe('adding a new blog', () => {
  test('verifiyng making an HTTP POST request', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'Go To Statement Considered Harmful'
    )
  })
  test('if new blog has no like property its deafult value is 0', async () => {
    const newBlog = {
      title: 'New Blog with no likes',
      author: 'Antonio Tugucci',
      url: 'https://blahblahblah.com',
    }

    const response = await api.post('/api/blogs')
      .send(newBlog)

    expect(response.body.likes).toEqual(0)
  })

  test('if url missing 400 returned', async () => {
    const newBlog = {
      author: 'Antonio Tugucci',
      title: 'newtitile'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('if title missing 400 returned', async () => {
    const newBlog = {
      author: 'Antonio Tugucci',
      url: 'http://kasdkadja.com'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(r => r.title)
    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('individual blog update', () => {
  test('Update likes for a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = { likes: blogToUpdate.likes + 1 }
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveProperty('likes', blogToUpdate.likes + 1)

  })
})

afterAll(async () => {
  await mongoose.connection.close()
})