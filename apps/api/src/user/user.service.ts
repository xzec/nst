import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { users } from '@workspace/database'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { DRIZZLE_TOKEN, type DrizzleDb } from '~/drizzle/drizzle.config'
import { z } from 'zod'
import { ZodValidationPipe } from '~/common/zod-validation.pipe'
import { ErrorCode } from '~/common/error'

export const userSelectSchema = createSelectSchema(users)

export const userInsertSchema = createInsertSchema(users)
export type UserInsert = z.infer<typeof userInsertSchema>
export const UserInsertValidationPipe = new ZodValidationPipe(userInsertSchema)

export const userUpdateSchema = createUpdateSchema(users)
export type UserUpdate = z.infer<typeof userUpdateSchema>
export const UserUpdateValidationPipe = new ZodValidationPipe(userUpdateSchema)

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDb) {}

  async findById(id: number) {
    const [row] = await this.db.select().from(users).where(eq(users.id, id))
    if (!row) throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: `User ${id} not found` })

    return userSelectSchema.parse(row)
  }

  async create(value: UserInsert) {
    const [row] = await this.db.insert(users).values(value).returning()

    return userSelectSchema.parse(row)
  }

  async update(id: number, value: UserUpdate) {
    const [row] = await this.db.update(users).set(value).where(eq(users.id, id)).returning()
    if (!row) throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: `User ${id} not found` })

    return userSelectSchema.parse(row)
  }

  async delete(id: number) {
    const [row] = await this.db.delete(users).where(eq(users.id, id)).returning()
    if (!row) throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: `User ${id} not found` })

    return userSelectSchema.parse(row)
  }
}
