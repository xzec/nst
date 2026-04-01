import { Module, Global, type DynamicModule } from '@nestjs/common'
import { createDb, type Database } from '@nest/database'
import { DRIZZLE } from './drizzle.token'

export type { Database }

export interface DrizzleModuleOptions {
  connectionString: string
}

@Global()
@Module({})
export class DrizzleModule {
  static forRoot(options: DrizzleModuleOptions): DynamicModule {
    return {
      module: DrizzleModule,
      providers: [
        {
          provide: DRIZZLE,
          useFactory: (): Database => {
            return createDb(options.connectionString)
          },
        },
      ],
      exports: [DRIZZLE],
    }
  }
}
