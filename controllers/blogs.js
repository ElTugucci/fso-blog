const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {

  const body = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'Invalid or missing token' })

  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  if (blog.title === undefined || blog.url === undefined) {
    return response.status(400).json({ error: 'Title and URL are required fields' })
  } else {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const user = request.user.id.toString()
  const blogCreator = await Blog.findById(request.params.id)


  if (blogCreator && user) {
    if (blogCreator.user.toString() === user) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).json({ message: 'Blog deleted successfully' })
    } else {
      response.status(401).json({ error: 'user and token´s don´t match' })
    }
  } else {
    response.status(401).json({ error: 'blog does not exist or blog id or token missing' })
  }

})

module.exports = blogRouter