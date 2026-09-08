import { type DynamicModule, Global, Inject, Module, type OnModuleDestroy } from '@nestjs/common'
import { createDrizzleInstance, DRIZZLE_TOKEN, type DrizzleDb } from '~/drizzle/drizzle.config'

export interface DrizzleModuleOptions {
  connectionString: string
  max?: number
  min?: number
  idleTimeoutMillis?: number
  connectionTimeoutMillis?: number
}

export interface DrizzleModuleAsyncOptions {
  inject?: any[]
  useFactory: (...args: any[]) => DrizzleModuleOptions | Promise<DrizzleModuleOptions>
}

@Global()
@Module({})
export class DrizzleModule implements OnModuleDestroy {
  constructor(@Inject(DRIZZLE_TOKEN) private readonly db: DrizzleDb) {}

  static forRoot(options: DrizzleModuleOptions): DynamicModule {
    return {
      module: DrizzleModule,
      providers: [
        {
          provide: DRIZZLE_TOKEN,
          useFactory: () => createDrizzleInstance(options),
        },
      ],
      exports: [DRIZZLE_TOKEN],
    }
  }

  static forRootAsync({ inject = [], useFactory }: DrizzleModuleAsyncOptions): DynamicModule {
    return {
      module: DrizzleModule,
      providers: [
        {
          provide: DRIZZLE_TOKEN,
          inject,
          useFactory: async (...args: any[]) => createDrizzleInstance(await useFactory(...args)),
        },
      ],
      exports: [DRIZZLE_TOKEN],
    }
  }

  async onModuleDestroy() {
    await this.db.$client.end()
  }
}
