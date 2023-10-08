import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { IUsersRepository } from '../repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private readonly repository: IUsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.repository.findByEmail(email)

    if (userWithSameEmail) throw new UserAlreadyExistsError()

    const passwordHash = await hash(password, 8)

    const user = await this.repository.create({
      name,
      email,
      password_hash: passwordHash,
    })
    return {
      user,
    }
  }
}
