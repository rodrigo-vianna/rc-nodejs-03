import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: 46.9959349,
      longitude: 8.603211,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: 47.3710229,
      longitude: 8.5309177,
    })

    const { gyms } = await sut.execute({
      userLatitude: 46.9951007,
      userLongitude: 8.6003678,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
    ])
  })
})
