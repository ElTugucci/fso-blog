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

  let token = null
  beforeEach(async () => {
    const response = await api.post('/api/login').send({
      'username': 'hellas',
      'password': 'salainen'
    })

    token = response.body.token
  })

  test('verifiyng making an HTTP POST request', async () => {


    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5

    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    expect(response.body.likes).toEqual(0)
  })

  test('if url missing 400 returned', async () => {
    const newblog = {
      author: 'antonio tugucci',
      title: 'newtitile'
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newblog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('if title missing 400 returned', async () => {
    const newblog = {
      author: 'antonio tugucci',
      url: 'http://kasdkadja.com'
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newblog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('returns 401 if unauthorised', async () => {
    const newBlog = {
      author: 'antonio tugucci',
      url: 'http://kasdkadja.com',
      likes: 5
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

})

describe('deletion of a blog', () => {
  let token = null
  beforeEach(async () => {
    const response = await api.post('/api/login').send({
      'username': 'hellas',
      'password': 'salainen'
    })

    token = response.body.token
  })
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[3]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
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

describe('user creation', () => {
  test('when username exists return 400', async () => {
    const newUser = {
      username: 'hellas',
      name: 'Arto Hellas',
      password: 'salainen'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(response.body.error).toEqual('Username must be unique')

  })
  test('when username or password length is too short', async () => {
    const newUser = {
      username: 'he',
      name: 'Arto Hellas',
      password: 'sa'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toEqual('username´s or password´s length is too short')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})