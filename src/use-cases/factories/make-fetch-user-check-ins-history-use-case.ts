import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

export const makeFetchUserCheckInsHistoryUseCase = () => {
  const repository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(repository)
  return useCase
}
