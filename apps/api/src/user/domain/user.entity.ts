import { type UserInsert, type UserSelect, userSelectSchema } from '~/user/user.schema'

interface UserProps {
  id: number
  name: string
  email: string
}

type CreateUserProps = Omit<UserProps, 'id'>

export class UserEntity {
  readonly id: number
  readonly name: string
  readonly email: string

  constructor(props: UserProps) {
    this.id = props.id
    this.name = props.name
    this.email = props.email
  }

  static create(props: CreateUserProps) {
    return new UserEntity({ id: 0, ...props })
  }

  static fromPersistence(row: UserSelect): UserEntity {
    return new UserEntity(userSelectSchema.parse(row))
  }

  toPersistence(): UserInsert {
    return { name: this.name, email: this.email }
  }
}
