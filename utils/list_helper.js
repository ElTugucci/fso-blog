const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, post) => total + post.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > (favorite ? favorite.likes : 0) ? blog : favorite
  }, null)
}

const mostBlogs = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const mostBlogsAuthor = _.maxBy(Object.keys(groupedByAuthor), author => groupedByAuthor[author].length)

  return {
    author: mostBlogsAuthor,
    blogs: groupedByAuthor[mostBlogsAuthor].length
  }
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const authorLikes = _.mapValues(groupedByAuthor, authorBlogs => _.sumBy(authorBlogs, 'likes'))
  const mostLikesAuthor = _.maxBy(Object.keys(authorLikes), author => authorLikes[author])

  return {
    author: mostLikesAuthor,
    likes: authorLikes[mostLikesAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}