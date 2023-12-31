import { PrismaGymsRepository } from '../../repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export const makeFetchNearbyGymsUseCase = () => {
  const repository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseCase(repository)
  return useCase
}
