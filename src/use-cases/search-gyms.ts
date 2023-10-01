import { IGymsRepository } from '../repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface SearchGymsUseCaseRequest {
  search: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private readonly repository: IGymsRepository) {}

  async execute({
    search,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.repository.searchMany(search, page)
    return {
      gyms,
    }
  }
}
