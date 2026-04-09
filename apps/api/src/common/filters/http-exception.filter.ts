import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Response } from 'express'
import type { ApiResponseError } from '~/common/types/api-response'
import { ErrorCode } from '~/common/error'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    // http exceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      return response.status(status).json({
        success: false,
        error: exception.getResponse(),
      } satisfies ApiResponseError)
    }

    // uncaught errors
    this.logger.error(exception)
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: { code: ErrorCode.INTERNAL_SERVER_ERROR, message: 'Internal server error' },
    } satisfies ApiResponseError)
  }
}
