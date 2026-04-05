import { Module } from '@nestjs/common'
import { UserController } from '~/user/user.controller'
import { UserService } from '~/user/user.service'
import { USER_REPOSITORY, UserRepository } from '~/user/user.repository'

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
