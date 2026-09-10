import { randomUUIDv7 } from 'node:crypto'
import { type UserInsert, type UserSelect, userSelectSchema } from '~/user/user.schema'

interface UserProps {
  id: string
  name: string
  email: string
}

type CreateUserProps = Omit<UserProps, 'id'>

export class UserEntity {
  readonly id: string
  readonly name: string
  readonly email: string

  constructor(props: UserProps) {
    this.id = props.id
    this.name = props.name
    this.email = props.email
  }

  static create(props: CreateUserProps) {
    return new UserEntity({ id: randomUUIDv7(), ...props })
  }

  static fromPersistence(row: UserSelect): UserEntity {
    return new UserEntity(userSelectSchema.parse(row))
  }

  toPersistence(): UserInsert {
    return { id: this.id, name: this.name, email: this.email }
  }
}
