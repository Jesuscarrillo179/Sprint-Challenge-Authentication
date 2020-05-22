const server = require('./server')
const supertest = require('supertest')
const db = require('../database/dbConfig')

afterEach(async () => {
    await db('users').truncate()
})

describe('server', () => {
    describe('POST / register', () => {
        it('returns status code 201', () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username:"jesus", password:"123abc"})
            .then(res => {
                expect(res.status).toBe(201)
            })
        })
        it('returns username', () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username:"jesus", password:"123abc"})
            .then(res => {
                expect(res.body.data).toMatchObject({id:1, username:"jesus"})
            })
        })
    })

    describe('POST / login', () => {
        it('returns status code 200', async () => {
            await supertest(server)
            .post('/api/auth/register')
            .send({username:"jesus", password:"123abc"})
            const res = await supertest(server)
            .post('/api/auth/login')
            .send({username:"jesus", password:"123abc"})
            expect(res.status).toBe(200)
        })
        it('returns success message', async () => {
            await supertest(server)
            .post('/api/auth/register')
            .send({username:"jesus", password:"123abc"})
            const res = await supertest(server)
            .post('/api/auth/login')
            .send({username:"jesus", password:"123abc"})
            expect(res.body.message).toBe("welcome to the api!")
        })
    })
})