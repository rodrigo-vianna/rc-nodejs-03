import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const email = 'johndoe@example.com'
  const password = '12345678'

  await request(app.server).post('/users').send({
    name: 'John Doe',
    email,
    password,
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email,
    password,
  })

  const { token } = authResponse.body
  return {
    token,
    email,
  }
}
