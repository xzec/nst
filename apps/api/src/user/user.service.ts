import { Injectable } from '@nestjs/common'
import { DrizzleService } from '~/drizzle'
import { eq } from 'drizzle-orm'
import { users } from '@workspace/database'
import { createSelectSchema } from 'drizzle-zod'

@Injectable()
export class UserService {
  private readonly userSelectSchema = createSelectSchema(users)

  constructor(private readonly drizzle: DrizzleService) {}

  async findById(id: number) {
    const rows = await this.drizzle.db.select().from(users).where(eq(users.id, id))
    const { data, error } = this.userSelectSchema.safeParse(rows[0])

    if (error) throw new Error(error.message)

    return data
  }
}
