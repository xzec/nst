import { Module } from '@nestjs/common'
import { AppController } from '~/app.controller'
import { AppService } from '~/app.service'
import { DrizzleService } from '~/drizzle'
import { UserController } from '~/user/user.controller'
import { UserService } from '~/user/user.service'

@Module({
  controllers: [AppController, UserController],
  providers: [AppService, DrizzleService, UserService],
})
export class AppModule {}
