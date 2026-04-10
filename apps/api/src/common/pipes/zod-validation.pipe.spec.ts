import { BadRequestException } from '@nestjs/common'
import { assert, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ZodValidationPipe } from '~/common/pipes/zod-validation.pipe'

const schema = z.object({
  name: z.string(),
  email: z.email(),
})

const pipe = new ZodValidationPipe(schema)

const input = { name: 'John', email: 'john@example.com' }
const inputWithExtra = { ...input, extra: true }
const invalidName = 123

describe('ZodValidationPipe', () => {
  it('returns parsed data for valid input', () => {
    expect(pipe.transform(input)).toEqual(input)
  })

  it('strips unknown properties from valid input', () => {
    expect(pipe.transform(inputWithExtra)).toEqual(input)
  })

  it('throws BadRequestException for invalid input', () => {
    expect(() => pipe.transform({ name: invalidName })).toThrow(BadRequestException)
  })

  it('includes field-level error details in the exception message', () => {
    try {
      pipe.transform({ name: invalidName })
      expect.unreachable('should have thrown on invalid input')
    } catch (error) {
      assert(error instanceof BadRequestException)
      const response = error.getResponse() as { message: string }
      expect(response.message).toMatch('name')
      expect(response.message).toMatch('email')
    }
  })
})
