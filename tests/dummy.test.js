const listHelper = require('../utils/list_helper')
const testHelper = require('./test_helper')
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

describe('dummy test', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('when list has only one testHelper.initialBlogs, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has few testHelper.initialBlogs', () => {
    const result = listHelper.totalLikes(testHelper.initialBlogs)
    expect(result).toBe(36)
  })
})

const formattedBlog = (blog) => {
  return{
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}
describe('favorite blog', () => {
  test('returns article by Dijkstra', () => {
    const result = listHelper.favoriteBlog(testHelper.initialBlogs)
    expect(formattedBlog(result)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })
})

describe('most blogs by author', () => {
  test('returns Martin with 3 blogs', () => {
    const result = listHelper.mostBlogs(testHelper.initialBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})

describe('most likes by author', () => {
  test('returns Dijkstra with 17 likes', () => {
    const result = listHelper.mostLikes(testHelper.initialBlogs)
    expect(result).toEqual({

      author: 'Edsger W. Dijkstra',
      likes: 17

    })
  })
})