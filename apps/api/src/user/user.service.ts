import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ErrorCode } from '~/common/error'
import { USER_REPOSITORY, type UserInsert, UserRepository, type UserUpdate } from '~/user/user.repository'

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  findById(id: number) {
    return this.userRepository.findById(id)
  }

  async create(value: UserInsert) {
    const user = await this.userRepository.create(value)

    return user
  }

  async update(id: number, value: UserUpdate) {
    const user = await this.userRepository.update(id, value)
    if (!user) throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: `User ${id} not found` })

    return user
  }

  async delete(id: number) {
    const user = await this.userRepository.delete(id)
    if (!user) throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: `User ${id} not found` })

    return { id: user.id }
  }
}
