const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
    {
        username: 'testusername1',
        name: 'testname1',
        password: 'testpassword1',
    },
    {
        username: 'testusername2',
        name: 'testname2',
        password: 'testpassword2',
    }
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

beforeEach(async () => {
    await User.deleteMany({})
    await api
        .post('/api/users')
        .send(initialUsers[0])
        .expect(201)
    await api
        .post('/api/users')
        .send(initialUsers[1])
        .expect(201)
})

test('users are returned as json', async () => {
    await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('login returns token', async () => {
    const user = {
        "username": "testusername1",
        "password": "testpassword1"
    }

    const response = await api
        .post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(typeof response.body.token, 'string', 'Token should be a string');
    assert(response.body.token.length > 0, 'Token should not be empty')
    assert.strictEqual(response.body.username, 'testusername1', 'Username should be the same');
})

describe('adding a user', () => {
    test('a valid user can be added', async () => {
        const newUser = {
            username: 'newtestusername1',
            name: 'newtestname1',
            password: 'newtestpassword1',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')

        const usernames = response.body.map(r => r.username)

        assert.strictEqual(response.body.length, initialUsers.length + 1)

        assert(usernames.includes('newtestusername1'))
    })

    test('too short username returns bad request error', async () => {
        const newUser = {
            username: 'aa',
            name: 'aaaaaaa',
            password: 'aaaaaaa',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')

        const usernames = response.body.map(r => r.username)

        assert.strictEqual(response.body.length, initialUsers.length)

        assert(!usernames.includes('aa'))
    })

    test('too short password returns bad request error', async () => {
        const newUser = {
            username: 'aaaaaa',
            name: 'aaaaaaa',
            password: 'aa',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')

        const usernames = response.body.map(r => r.username)

        assert.strictEqual(response.body.length, initialUsers.length)

        assert(!usernames.includes('aaaaaa'))
    })

    test('no username returns bad request error', async () => {
        const newUser = {
            name: 'aaaaaaa',
            password: 'aaaaaaa',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')

        const usernames = response.body.map(r => r.username)

        assert.strictEqual(response.body.length, initialUsers.length)

        assert(!usernames.includes('aa'))
    })

    test('no password returns bad request error', async () => {
        const newUser = {
            username: 'aaaaaa',
            name: 'aaaaaaa',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/users')

        const usernames = response.body.map(r => r.username)

        assert.strictEqual(response.body.length, initialUsers.length)

        assert(!usernames.includes('aaaaaa'))
    })
})

test('users store all necessary data', async () => {
    const currentUsers = await usersInDb()

    const allUsersHaveUserName = currentUsers.every(user => user.username)
    assert.strictEqual(allUsersHaveUserName, true, 'Not all users have a username')

    const allUsersHaveName = currentUsers.every(user => user.name)
    assert.strictEqual(allUsersHaveName, true, 'Not all users have a name')
})

after(async () => {
    await mongoose.connection.close()
})