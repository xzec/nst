import { Inject, Injectable } from '@nestjs/common'
import { DRIZZLE_TOKEN, type DrizzleDb } from '~/drizzle/drizzle.config'
import { eq } from 'drizzle-orm'
import { users } from '@workspace/database'
import { type UserSelect, type UserUpdate, userSelectSchema } from '~/user/user.schema'
import { UserEntity } from '~/user/domain/user.entity'

export const USER_REPOSITORY = Symbol('USER_REPOSITORY')

@Injectable()
export class UserRepository {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDb) {}

  async findById(id: number): Promise<UserSelect | null> {
    const [row] = await this.db.select().from(users).where(eq(users.id, id))
    if (!row) return null

    return userSelectSchema.parse(row)
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const persistedUser = user.toPersistence()
    const [row] = await this.db.insert(users).values(persistedUser).returning()

    return UserEntity.fromPersistence(row)
  }

  async update(id: number, value: UserUpdate): Promise<UserSelect | null> {
    const [row] = await this.db.update(users).set(value).where(eq(users.id, id)).returning()
    if (!row) return null

    return userSelectSchema.parse(row)
  }

  async delete(id: number): Promise<UserSelect | null> {
    const [row] = await this.db.delete(users).where(eq(users.id, id)).returning()
    if (!row) return null

    return userSelectSchema.parse(row)
  }
}
