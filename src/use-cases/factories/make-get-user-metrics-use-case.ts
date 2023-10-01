import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

export const makeGetUserMetricsUseCase = () => {
  const repository = new PrismaCheckInsRepository()
  const useCase = new GetUserMetricsUseCase(repository)
  return useCase
}
