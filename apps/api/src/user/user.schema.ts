import { users } from '@workspace/database'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ZodValidationPipe } from '~/common/pipes/zod-validation.pipe'

export const userSelectSchema = createSelectSchema(users)
export type UserSelect = z.infer<typeof userSelectSchema>

export const userInsertSchema = createInsertSchema(users)
export type UserInsert = z.infer<typeof userInsertSchema>
export const UserInsertValidationPipe = new ZodValidationPipe(userInsertSchema)

export const userUpdateSchema = createUpdateSchema(users)
export type UserUpdate = z.infer<typeof userUpdateSchema>
export const UserUpdateValidationPipe = new ZodValidationPipe(userUpdateSchema)
