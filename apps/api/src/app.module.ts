import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DrizzleModule } from '~/drizzle'
import { UserModule } from '~/user/user.module'
import { validateEnv } from '~/config/env.schema'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
      validate: validateEnv,
    }),
    DrizzleModule.forRoot(),
    UserModule,
  ],
})
export class AppModule {}
