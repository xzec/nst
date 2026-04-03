import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { users } from '@workspace/database'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { DRIZZLE_TOKEN, type DrizzleDb } from '~/drizzle/drizzle.config'
import { z } from 'zod'
import { ZodValidationPipe } from '~/config/zod-validation.pipe'

export const userSelectSchema = createSelectSchema(users)

export const userInsertSchema = createInsertSchema(users)
export type UserInsert = z.infer<typeof userInsertSchema>
export const UserInsertValidationPipe = new ZodValidationPipe(userInsertSchema)

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDb) {}

  async findById(id: number) {
    const [row] = await this.db.select().from(users).where(eq(users.id, id))
    const { data, error } = userSelectSchema.safeParse(row)

    if (error) return null

    return data
  }

  async create(values: UserInsert) {
    const [row] = await this.db.insert(users).values(values).returning()

    return row
  }
}
