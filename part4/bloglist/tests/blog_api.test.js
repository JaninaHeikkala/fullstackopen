const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Title 1',
        author: 'Author 1',
        url: 'Url 1',
        likes: 1
    },
    {
        title: 'Title 2',
        author: 'Author 2',
        url: 'Url 2',
        likes: 2
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
})

test('blog entries contain _id', async () => {
    const response = await api.get('/api/blogs')
    const allHaveId = response.body.every(blog => blog.hasOwnProperty('id'))
    assert.strictEqual(allHaveId, true)
})

test('a valid blog can be added', async () => {
    const newBlog = {
            title: 'New Title',
            author: 'New Author',
            url: 'New Url',
            likes: 3
        }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const authors = response.body.map(r => r.author)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    assert(authors.includes('New Author'))
})

test('likes default to zero', async () => {
    const newBlog = {
        title: 'New Title Zero',
        author: 'New Author Zero',
        url: 'New Url Zero',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const likes = response.body.map(r => r.likes)

    assert(likes.includes(0))
})

test('no title returns bad request error', async () => {
    const newBlog = {
        author: 'New Author No Title',
        url: 'New Url No Title',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test('no url returns bad request error', async () => {
    const newBlog = {
        title: 'New Title No Url',
        author: 'New Author No Url',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})