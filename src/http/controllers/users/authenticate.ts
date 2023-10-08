import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '../../../use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '../../../use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const useCase = makeAuthenticateUseCase()
    const { user } = await useCase.execute({ email, password })
    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      { sub: user.id },
    )
    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      { sub: user.id, expiresIn: '7d' },
    )
    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: true, // HTTPS
        sameSite: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError)
      return reply.status(400).send({
        message: err.message,
      })
    throw err
  }
}
