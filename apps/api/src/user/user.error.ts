import { DomainError, PG_ERROR_CODES } from '~/common/error'
import { DrizzleQueryError } from 'drizzle-orm'
import { DatabaseError } from 'pg'
import { USERS_EMAIL_UNIQUE_CONSTRAINT } from '@workspace/database'

export class UserError extends DomainError {
  constructor(message: string, cause?: unknown) {
    super(message)
    this.cause = cause
  }

  /**
   * Maps a Drizzle database error into a domain error.
   * @throws {error} The original error if no mapping exists.
   */
  public static fromDrizzle(error: unknown): UserError {
    // drizzle wraps DatabaseError in `cause` property of DrizzleQueryError, so we need to unwrap it
    if (error instanceof DrizzleQueryError && error.cause instanceof DatabaseError) {
      if (
        error.cause.code === PG_ERROR_CODES.UNIQUE_VIOLATION &&
        error.cause.constraint === USERS_EMAIL_UNIQUE_CONSTRAINT
      )
        return new UserEmailExistsError(error)
    }
    throw error
  }
}

export class UserNotFoundError extends UserError {
  constructor(cause?: unknown) {
    super('User not found', cause)
  }
}

export class UserEmailExistsError extends UserError {
  constructor(cause?: unknown) {
    super('E-mail address is already in use', cause)
  }
}
