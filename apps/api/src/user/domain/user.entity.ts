import { randomUUIDv7 } from 'node:crypto'
import { type UserInsert, type UserSelect } from '~/user/user.schema'

interface UserProps {
  id: string
  name: string
  email: string
}

type CreateUserProps = Omit<UserProps, 'id'>

type MergeUserProps = Partial<CreateUserProps>

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
    return new UserEntity(row)
  }

  props(): UserProps {
    return { id: this.id, name: this.name, email: this.email }
  }

  merge(props: MergeUserProps): UserEntity {
    return new UserEntity({ ...this.props(), ...props })
  }

  toPersistence(): UserInsert {
    return this.props()
  }
}
