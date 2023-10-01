import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let gymsRepository: InMemoryGymsRepository;
let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe('CheckIns Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)
    gymsRepository.create({
      id: 'gym-id',
      title: 'Gym',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice in the same date', async () => {
    vi.setSystemTime(new Date(2023, 4, 20, 8, 0, 0, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() => sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })).rejects.toThrowError(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 4, 20, 8, 0, 0, 0))

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2023, 4, 21, 8, 0, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.create({
      id: 'gym-2',
      title: 'Gym',
      latitude: new Decimal(46.9973097),
      longitude: new Decimal(8.6040222),
    })

    await expect(() => sut.execute({
      gymId: 'gym-2',
      userId: 'user-id',
      userLatitude: 47.0330723,
      userLongitude: 8.634908,
    })).rejects.toThrowError(MaxDistanceError)
  })
})
