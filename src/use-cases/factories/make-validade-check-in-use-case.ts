import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export const makeValidadeCheckInUseCase = () => {
  const repository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInUseCase(repository)
  return useCase
}
