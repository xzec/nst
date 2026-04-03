import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createDrizzleInstance, DRIZZLE_TOKEN } from '~/drizzle/drizzle.config'
import type { Env } from '~/common/env.schema'

@Global()
@Module({})
export class DrizzleModule {
  static forRoot() {
    return {
      module: DrizzleModule,
      providers: [
        {
          provide: DRIZZLE_TOKEN,
          inject: [ConfigService],
          useFactory: (configService: ConfigService<Env, true>) => {
            return createDrizzleInstance({
              connectionString: configService.get('DATABASE_URL', { infer: true }),
              max: configService.get('DB_POOL_MAX', { infer: true }),
              min: configService.get('DB_POOL_MIN', { infer: true }),
              idleTimeoutMillis: configService.get('DB_POOL_IDLE_TIMEOUT_MS', { infer: true }),
              connectionTimeoutMillis: configService.get('DB_POOL_CONNECTION_TIMEOUT_MS', { infer: true }),
            })
          },
        },
      ],
      exports: [DRIZZLE_TOKEN],
    }
  }
}
