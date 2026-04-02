import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { schema } from '@workspace/database'
import { drizzle } from 'drizzle-orm/node-postgres'

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  readonly db: ReturnType<typeof drizzle>

  constructor() {
    this.db = drizzle(process.env.DATABASE_URL, { schema })
  }

  async onModuleDestroy() {
    await this.db.$client.end()
  }
}
