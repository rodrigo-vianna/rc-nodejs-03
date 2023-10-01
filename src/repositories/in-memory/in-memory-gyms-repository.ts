import { randomUUID } from 'node:crypto'
import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, IGymsRepository } from '../gyms-repository'
import { getDistanceBetweenCoordinates } from '../../utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements IGymsRepository {
  public items: Gym[] = []

  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    const gyms = this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )
      return distance < 10
    })
    return Promise.resolve(gyms)
  }

  searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = this.items
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
    return Promise.resolve(gyms)
  }

  findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((checkIn) => checkIn.id === id)
    return Promise.resolve(gym || null)
  }

  create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description || null,
      phone: data.phone || null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }
    this.items.push(gym)
    return Promise.resolve(gym)
  }
}
