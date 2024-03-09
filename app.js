const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')
const { info, err } = require('./utils/logger')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

info('connecting to MongoDB')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    info('Connected to MongoDB')
  })
  .catch((error) => {
    err('error connecting to MongoDB:', error)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.errorHandler)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
module.exports = app