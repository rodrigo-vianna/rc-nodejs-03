import { randomUUID } from 'node:crypto'
import { CheckIn, Prisma } from '@prisma/client'
import { ICheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public items: CheckIn[] = []

  save(checkIn: CheckIn): Promise<CheckIn> {
    const index = this.items.findIndex((item) => item.id === checkIn.id)
    if (index >= 0) this.items[index] = checkIn
    return Promise.resolve(checkIn)
  }

  findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.items.find((checkIn) => checkIn.id === id)
    return Promise.resolve(checkIn || null)
  }

  countByUserId(userId: string): Promise<number> {
    const checkInsCount = this.items.filter(
      (checkIn) => checkIn.user_id === userId,
    ).length
    return Promise.resolve(checkInsCount)
  }

  findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
    return Promise.resolve(checkIns)
  }

  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })
    return Promise.resolve(checkOnSameDate || null)
  }

  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }
    this.items.push(checkIn)
    return Promise.resolve(checkIn)
  }
}
