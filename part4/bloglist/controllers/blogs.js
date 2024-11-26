const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.get('/',  (request, response) => {
    Blog
        .find({}).populate('user', { name: 1, username: 1, id: 1 }).then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', async (request, response) => {
    if (!request.token) return response.status(400).json({ error: 'No token found' })
    if (!request.body.title) return response.status(400).json({ error: 'Title not found' })
    if (!request.body.url) return response.status(400).json({ error: 'URL not found' })

    try {
        const user = request.user

        let blogData = {
            ...request.body,
            likes: request.body.likes || 0,
            user: user.id,
        }
        const blog = new Blog(blogData)

        await blog.save()

        user.blogs = user.blogs.concat(blog._id)
        await user.save()

        response.status(201).json(blog)
    } catch (error) {
        return response.status(500).json({ error: 'An error occurred', details: error.message });
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    if (!request.token) return response.status(400).json({error: 'No token found'})

    try {
        const user = request.user
        const blog = await Blog.findById(request.params.id)
        if (!blog) {
            return response.status(404).json({ error: 'blog not found' })
        }

        if ( blog.user.toString() === user.id.toString() ) {
            await Blog.findByIdAndDelete(request.params.id)
            user.blogs = user.blogs.filter(blogId => blogId.toString() !== blog.id.toString())
            await user.save()
            return response.status(204).end()
        } else {
            return response.status(401).json({error: 'you cannot delete blogs you dont own'})
        }

    } catch (error) {
        return response.status(500).json({ error: 'An error occurred', details: error.message });
    }
})

blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    Blog.findByIdAndUpdate(request.params.id, blog)
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

module.exports = blogsRouter