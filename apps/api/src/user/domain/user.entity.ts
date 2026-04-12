import { type UserInsert, type UserSelect, userSelectSchema } from '~/user/user.schema'
import { CreateUserDto } from '~/user/dto/create-user.dto'
import type { UserProps } from '~/user/domain/user.types'

export class UserEntity {
  readonly id: number
  readonly name: string
  readonly email: string

  constructor(props: UserProps) {
    this.id = props.id
    this.name = props.name
    this.email = props.email
  }

  static create(props: CreateUserDto) {
    return new UserEntity({ id: NaN, ...props })
  }

  static fromPersistence(row: UserSelect | undefined): UserEntity {
    return new UserEntity(userSelectSchema.parse(row))
  }

  toPersistence(): UserInsert {
    return { name: this.name, email: this.email }
  }
}
