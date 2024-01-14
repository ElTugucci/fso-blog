const config = require ('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const { info, err } = require('./utils/logger')


info('connecting to MongoDB')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    info('Connected to MongoDB')
  })
  .catch(( error ) => {
    err('error connecting to MongoDB:', error)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use('/api/blogs', blogRouter)
module.exports = app