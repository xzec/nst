import { Inject, Injectable } from '@nestjs/common'
import { DRIZZLE_TOKEN, type DrizzleDb } from '~/drizzle/drizzle.config'
import { eq } from 'drizzle-orm'
import { users } from '@workspace/database'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { ZodValidationPipe } from '~/common/zod-validation.pipe'
import { z } from 'zod'

export const USER_REPOSITORY = Symbol('USER_REPOSITORY')

export const userSelectSchema = createSelectSchema(users)
export type User = z.infer<typeof userSelectSchema>

export const userInsertSchema = createInsertSchema(users)
export type UserInsert = z.infer<typeof userInsertSchema>
export const UserInsertValidationPipe = new ZodValidationPipe(userInsertSchema)

export const userUpdateSchema = createUpdateSchema(users)
export type UserUpdate = z.infer<typeof userUpdateSchema>
export const UserUpdateValidationPipe = new ZodValidationPipe(userUpdateSchema)

@Injectable()
export class UserRepository {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDb) {}

  async findById(id: number): Promise<User | null> {
    const [row] = await this.db.select().from(users).where(eq(users.id, id))
    if (!row) return null

    return userSelectSchema.parse(row)
  }

  async create(value: UserInsert): Promise<User> {
    const [row] = await this.db.insert(users).values(value).returning()

    return userSelectSchema.parse(row)
  }

  async update(id: number, value: UserUpdate): Promise<User | null> {
    const [row] = await this.db.update(users).set(value).where(eq(users.id, id)).returning()
    if (!row) return null

    return userSelectSchema.parse(row)
  }

  async delete(id: number): Promise<User | null> {
    const [row] = await this.db.delete(users).where(eq(users.id, id)).returning()
    if (!row) return null

    return userSelectSchema.parse(row)
  }
}
