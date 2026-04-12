import { z } from 'zod'
import { ZodValidationPipe } from '~/common/pipes/zod-validation.pipe'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

const createUserSchema = z.object({
  name: z.string(),
  email: z.email(),
})

export const CreateUserValidationPipe = new ZodValidationPipe(createUserSchema)

@ApiSchema({ name: 'CreateUserRequest', description: 'Create user request' })
export class CreateUserDto {
  @ApiProperty({ description: 'User name' })
  readonly name: string

  @ApiProperty({ description: 'User e-mail' })
  readonly email: string

  constructor(data: z.infer<typeof createUserSchema>) {
    this.name = data.name
    this.email = data.email
  }
}
