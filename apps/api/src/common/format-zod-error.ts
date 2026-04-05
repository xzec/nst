import type { ZodError } from 'zod'

export function formatZodError(message: string, error: ZodError) {
  const issues = error.issues.map((issue) => ` - ${issue.path.join('.')}: ${issue.message}`)
  return [message, ...issues].join('\n')
}
