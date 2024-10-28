const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', (request, response) => {
    if (!request.body.title) return response.status(400).json({ error: 'Title not found' })
    if (!request.body.url) return response.status(400).json({ error: 'URL not found' })

    let blogData = {
        ...request.body,
        likes: request.body.likes || 0
    }
    const blog = new Blog(blogData)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

module.exports = blogsRouter