import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '../../repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in'

export const makeCheckInUseCase = () => {
  const repository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(repository, gymsRepository)
  return useCase
}
