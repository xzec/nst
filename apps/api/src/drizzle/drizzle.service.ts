import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { createDb, type Database } from '@nest/database'

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  readonly db: Database

  constructor() {
    this.db = createDb(process.env.DATABASE_URL)
  }

  async onModuleDestroy() {
    await this.db.$client.end()
  }
}
