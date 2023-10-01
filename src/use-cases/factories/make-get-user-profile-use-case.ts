import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export const makeGetUserProfileUseCase = () => {
  const repository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(repository)
  return useCase
}
