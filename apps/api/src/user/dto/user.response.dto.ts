import { z } from 'zod'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'
import type { UserEntity } from '~/user/domain/user.entity'

const userResponseSchema = z.object({
  id: z.uuidv7(),
  name: z.string(),
  email: z.string(),
})

@ApiSchema({ name: 'UserResponse', description: 'User response' })
export class UserResponseDto {
  @ApiProperty({ description: 'User id' })
  readonly id: string

  @ApiProperty({ description: 'User name' })
  readonly name: string

  @ApiProperty({ description: 'User e-mail' })
  readonly email: string

  private constructor(data: z.infer<typeof userResponseSchema>) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
  }

  static fromEntity(entity: UserEntity): UserResponseDto {
    return new UserResponseDto(userResponseSchema.parse(entity))
  }
}
