import { DomainError } from '~/common/error'

export class UserError extends DomainError {
  constructor(message: string) {
    super(message)
  }
}

export class UserNotFoundError extends UserError {
  constructor() {
    super('User not found')
  }
}

export class UserExistsError extends UserError {
  constructor() {
    super('User already exists')
  }
}
