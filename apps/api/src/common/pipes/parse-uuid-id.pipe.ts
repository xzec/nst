import { BadRequestException, ParseUUIDPipe } from '@nestjs/common'
import { ErrorCode } from '~/common/error'

export const ParseUuidIdPipe = new ParseUUIDPipe({
  version: '7',
  exceptionFactory: (error) => new BadRequestException({ code: ErrorCode.BAD_REQUEST, message: error }),
})
