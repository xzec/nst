import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DrizzleModule } from '~/drizzle'
import { UserModule } from '~/user/user.module'
import { validateEnv } from '~/common/config/env.schema'
import { LoggerMiddleware } from '~/common/middleware/logger.middleware'

const nodeEnv = process.env.NODE_ENV ?? 'development'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`../../.env.${nodeEnv}.local`, `../../.env.${nodeEnv}`, `.env.${nodeEnv}.local`, `.env.${nodeEnv}`],
      validate: validateEnv,
    }),
    DrizzleModule.forRoot(),
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
