import { BadRequestException, PipeTransform } from '@nestjs/common'
import type { ZodType } from 'zod'
import { formatZodError } from '~/common/format-zod-error'

export class ZodValidationPipe<T extends ZodType> implements PipeTransform {
  constructor(private schema: T) {}

  transform(value: unknown) {
    const { error, data } = this.schema.safeParse(value)
    if (error) {
      throw new BadRequestException(formatZodError('Invalid request parameters:', error))
    }
    return data
  }
}
