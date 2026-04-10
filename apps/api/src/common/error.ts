export const ErrorCode = {
  // Resource
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  // Conflict
  USER_EXISTS: 'USER_EXISTS',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  // General
  BAD_REQUEST: 'BAD_REQUEST',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

export interface ErrorResponse {
  code: ErrorCode
  message: string
}

export abstract class DomainError extends Error {
  protected constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

/**
 * PostgreSQL error codes
 * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export const PG_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
} as const
