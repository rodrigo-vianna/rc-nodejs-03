import { randomUUID } from 'node:crypto'
import { Prisma, User } from '@prisma/client'
import { IUsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = []

  findById(id: string): Promise<User | null> {
    const user = this.items.find((user) => user.id === id)
    return Promise.resolve(user || null)
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }
    this.items.push(user)
    return Promise.resolve(user)
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email)
    return Promise.resolve(user || null)
  }
}
