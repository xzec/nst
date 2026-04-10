import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ErrorCode } from '~/common/error'
import { USER_REPOSITORY, UserRepository } from '~/user/user.repository'
import type { UserInsert, UserSelect, UserUpdate } from '~/user/user.schema'
import { UserError, UserNotFoundError } from '~/user/user.error'
import { Err, Ok, type Result } from 'oxide.ts'

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  async findById(id: number): Promise<Result<UserSelect, UserError>> {
    const user = await this.userRepository.findById(id)
    if (!user) return Err(new UserNotFoundError())
    return Ok(user)
  }

  async create(value: UserInsert): Promise<Result<UserSelect, UserError>> {
    try {
      const user = await this.userRepository.create(value)
      return Ok(user)
    } catch (error) {
      return Err(UserError.fromDrizzle(error))
    }
  }

  async update(id: number, value: UserUpdate): Promise<Result<UserSelect, UserError>> {
    try {
      const user = await this.userRepository.update(id, value)
      if (!user) return Err(new UserNotFoundError())
      return Ok(user)
    } catch (error) {
      return Err(UserError.fromDrizzle(error))
    }
  }

  async delete(id: number) {
    const user = await this.userRepository.delete(id)
    if (!user) throw new NotFoundException({ code: ErrorCode.USER_NOT_FOUND, message: `User ${id} not found` })

    return { id: user.id }
  }
}
