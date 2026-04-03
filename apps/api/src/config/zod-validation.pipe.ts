import { BadRequestException, PipeTransform } from '@nestjs/common'
import type { ZodType } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (_error) {
      throw new BadRequestException('Validation failed')
    }
  }
}
