import { Inject, Injectable } from '@nestjs/common'
import { DRIZZLE_TOKEN, type DrizzleDb } from '~/drizzle/drizzle.config'
import { eq } from 'drizzle-orm'
import { users } from '@workspace/database'
import { Err, Ok, type Result } from 'oxide.ts'
import { UserError, UserNotFoundError } from '~/user/user.error'
import { type UserSelect, type UserInsert, type UserUpdate, userSelectSchema } from '~/user/user.schema'

export const USER_REPOSITORY = Symbol('USER_REPOSITORY')

@Injectable()
export class UserRepository {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDb) {}

  async findById(id: number): Promise<Result<UserSelect, UserError>> {
    const [row] = await this.db.select().from(users).where(eq(users.id, id))
    if (!row) return Err(new UserNotFoundError())

    return Ok(userSelectSchema.parse(row))
  }

  async create(value: UserInsert): Promise<UserSelect> {
    const [row] = await this.db.insert(users).values(value).returning()

    return userSelectSchema.parse(row)
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
