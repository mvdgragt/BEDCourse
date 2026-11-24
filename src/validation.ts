import type { Response } from 'express'
import { z } from 'zod'

// Route ids arrive as text ("1"), so coerce them into numbers
export const IdSchema = z.coerce.number().int().positive()

// Same 400 shape for every API: { error, issues: { field: [messages] } }
export const sendValidationError = (res: Response, error: z.ZodError) => {
  res.status(400).json({
    error: 'Validation failed',
    issues: z.flattenError(error).fieldErrors,
  })
}

export const sendNotFound = (res: Response, what: string) => {
  res.status(404).json({ error: `${what} not found` })
}
