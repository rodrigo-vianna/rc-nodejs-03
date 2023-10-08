import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'
import { prisma } from '../../lib/prisma'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  role: 'ADMIN' | 'MEMBER' = 'MEMBER',
) {
  const email = 'johndoe@example.com'
  const password = '12345678'

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email,
      password_hash: await hash(password, 6),
      role,
    },
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
