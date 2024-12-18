const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require("../models/user");

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Title 1',
        author: 'Author 1',
        url: 'Url 1',
        likes: 1,
    },
    {
        title: 'Title 2',
        author: 'Author 2',
        url: 'Url 2',
        likes: 2,
    },
]

const initialUser = [
    {
        username: 'blogsuser1',
        name: 'blogsname1',
        password: 'blogspassword1',
    },
]

let token = null

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const userResponse = await api
        .post('/api/users')
        .send(initialUser[0])
        .expect(201);

    const user = await User.findOne({ username: initialUser[0].username });

    const blogObject1 = new Blog({ ...initialBlogs[0], user: user._id });
    const blogObject2 = new Blog({ ...initialBlogs[1], user: user._id });

    await blogObject1.save();
    await blogObject2.save();

    user.blogs = [blogObject1._id, blogObject2._id];
    await user.save();

    const loginResponse = await api
        .post('/api/login')
        .send({
            username: initialUser[0].username,
            password: initialUser[0].password,
        })
        .expect(200);

    token = loginResponse.body.token;
});


test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await blogsInDb()
        const blogToDelete = blogsAtStart[0]

        const resp = await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await blogsInDb()

        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

        const authors = blogsAtEnd.map(r => r.author)
        assert(!authors.includes(blogsAtEnd.author))
    })
})

describe('updating a blog', () => {
    test('an existing blog can be updated', async () => {
        const updatedBlog = {
            title: 'Updated Title',
            author: 'Updated Author',
            url: 'Updated Url',
            likes: 4
        }

        const blogsAtStart = await blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, initialBlogs.length)

        const blogsAfterUpdate = await blogsInDb()

        assert.strictEqual(blogsAfterUpdate[0].likes, 4)
    })
})


describe('adding a blog', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'New Title',
            author: 'New Author',
            url: 'New Url',
            likes: 3
        }

        const blogresp = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const authors = response.body.map(r => r.author)

        assert.strictEqual(response.body.length, initialBlogs.length + 1)

        assert(authors.includes('New Author'))

        const users = await usersInDb()

        assert.strictEqual(users[0].blogs[2].toString(), blogresp.body.id)
    })

    test('likes default to zero', async () => {
        const newBlog = {
            title: 'New Title Zero',
            author: 'New Author Zero',
            url: 'New Url Zero',
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('no token returns unauthorized', async () => {
        const newBlog = {
            title: 'New Title',
            author: 'New Author',
            url: 'New Url',
            likes: 3
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })
})

test('blog entries contain id', async () => {
    const response = await api.get('/api/blogs')
    const allHaveId = response.body.every(blog => blog.hasOwnProperty('id'))
    assert.strictEqual(allHaveId, true)
})

after(async () => {
    await mongoose.connection.close()
})