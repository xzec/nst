import { BadRequestException, ParseIntPipe } from '@nestjs/common'
import { ErrorCode } from '~/common/error'

export const ParseIntIdPipe = new ParseIntPipe({
  exceptionFactory: (error) => new BadRequestException({ code: ErrorCode.BAD_REQUEST, message: error }),
})
