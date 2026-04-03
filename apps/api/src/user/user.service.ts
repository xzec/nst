import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { users } from '@workspace/database'
import { createSelectSchema } from 'drizzle-zod'
import { DRIZZLE_TOKEN, type DrizzleDb } from '~/drizzle/drizzle.config'

@Injectable()
export class UserService {
  private readonly userSelectSchema = createSelectSchema(users)

  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDb) {}

  async findById(id: number) {
    const rows = await this.db.select().from(users).where(eq(users.id, id))
    const { data, error } = this.userSelectSchema.safeParse(rows[0])

    if (error) return null

    return data
  }
}
