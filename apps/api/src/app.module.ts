import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DrizzleModule } from '~/drizzle'
import { UserModule } from '~/user/user.module'
import { type Env, validateEnv } from '~/common/config/env.schema'
import { LoggerMiddleware } from '~/common/middleware/logger.middleware'

const nodeEnv = process.env.NODE_ENV ?? 'development'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`../../.env.${nodeEnv}.local`, `../../.env.${nodeEnv}`, `.env.${nodeEnv}.local`, `.env.${nodeEnv}`],
      validate: validateEnv,
    }),
    DrizzleModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        connectionString: configService.get('DATABASE_URL', { infer: true }),
        max: configService.get('DB_POOL_MAX', { infer: true }),
        min: configService.get('DB_POOL_MIN', { infer: true }),
        idleTimeoutMillis: configService.get('DB_POOL_IDLE_TIMEOUT_MS', { infer: true }),
        connectionTimeoutMillis: configService.get('DB_POOL_CONNECTION_TIMEOUT_MS', { infer: true }),
      }),
    }),
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
