import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export const makeRegisterUseCase = () => {
  const repository = new PrismaUsersRepository()
  const useCase = new RegisterUseCase(repository)
  return useCase
}
