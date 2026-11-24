// ---------------------------------------------------------------
// HARD: Staff shifts API  –  /api/shifts
// Every request needs two headers:
//   x-role:    ADMIN or STAFF
//   x-user-id: a positive whole number
// ---------------------------------------------------------------
import { Router, type RequestHandler } from 'express'
import { z } from 'zod'
import { IdSchema, sendNotFound, sendValidationError } from './validation'

export const UserRoleSchema = z.enum(['ADMIN', 'STAFF'])
export const PositionSchema = z.enum(['WAITER', 'RUNNER', 'HEAD_WAITER'])
export const ShiftStatusSchema = z.enum(['OPEN', 'ASSIGNED', 'COMPLETED'])

const clock = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be HH:MM')

// What we ACCEPT
export const CreateShiftSchema = z
  .object({
    date: z.iso.date('Date must be YYYY-MM-DD'),
    start: clock,
    end: clock,
    position: PositionSchema,
  })
  .refine((s) => s.end >= s.start, { message: 'End must be after start', path: ['end'] })

// What we PROMISE
export const ShiftSchema = z.object({
  id: z.number().int().positive(),
  date: z.iso.date(),
  start: clock,
  end: clock,
  position: PositionSchema,
  status: ShiftStatusSchema,
  assignedTo: z.number().int().positive().nullable(),
})

export const ShiftPageSchema = z.object({
  data: z.array(ShiftSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
})

export type Shift = z.infer<typeof ShiftSchema>
type User = { role: z.infer<typeof UserRoleSchema>; id: number }

const ShiftQuerySchema = z.object({
  status: ShiftStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).default(5),
})

// 401: we don't know who you are
const authenticate: RequestHandler = (req, res, next) => {
  const role = UserRoleSchema.safeParse(req.header('x-role'))
  const id = IdSchema.safeParse(req.header('x-user-id'))
  if (!role.success || !id.success) {
    res.status(401).json({ error: 'Missing or invalid x-role / x-user-id headers' })
    return
  }
  res.locals.user = { role: role.data, id: id.data } satisfies User
  next()
}

// 403: we know who you are, but you're not allowed
const requireRole =
  (role: User['role']): RequestHandler =>
  (req, res, next) => {
    if ((res.locals.user as User).role !== role) {
      res.status(403).json({ error: `Only ${role} can do this` })
      return
    }
    next()
  }

export const shiftsRouter = () => {
  const router = Router()
  router.use(authenticate)

  const shifts: Shift[] = [
    { id: 1, date: '2026-12-24', start: '16:00', end: '23:00', position: 'WAITER', status: 'OPEN', assignedTo: null },
    { id: 2, date: '2026-12-24', start: '16:00', end: '23:00', position: 'RUNNER', status: 'ASSIGNED', assignedTo: 2 },
    { id: 3, date: '2026-12-24', start: '11:00', end: '16:00', position: 'HEAD_WAITER', status: 'OPEN', assignedTo: null },
    { id: 4, date: '2026-12-25', start: '12:00', end: '20:00', position: 'WAITER', status: 'OPEN', assignedTo: null },
    { id: 5, date: '2026-12-25', start: '12:00', end: '20:00', position: 'RUNNER', status: 'COMPLETED', assignedTo: 3 },
    { id: 6, date: '2026-12-31', start: '17:00', end: '23:59', position: 'WAITER', status: 'OPEN', assignedTo: null },
    { id: 7, date: '2026-12-31', start: '17:00', end: '23:59', position: 'RUNNER', status: 'OPEN', assignedTo: null },
  ]
  let nextId = 8

  const findShift = (rawId: unknown) => {
    const id = IdSchema.safeParse(rawId)
    return id.success ? shifts.find((s) => s.id === id.data) : undefined
  }

  // GET /api/shifts?status=OPEN&page=1&limit=5   (any logged-in user)
  router.get('/', (req, res) => {
    const query = ShiftQuerySchema.safeParse(req.query)
    if (!query.success) {
      sendValidationError(res, query.error)
      return
    }
    const { status, page, limit } = query.data
    const filtered = shifts.filter((s) => status === undefined || s.status === status)
    const startIndex = page * limit
    res.json({
      data: filtered.slice(startIndex, startIndex + limit),
      page,
      limit,
      total: shifts.length,
    })
  })

  // GET /api/shifts/:id   (any logged-in user)
  router.get('/:id', (req, res) => {
    const shift = findShift(req.params.id)
    if (!shift) {
      sendNotFound(res, 'Shift')
      return
    }
    res.json(shift)
  })

  // POST /api/shifts   (ADMIN only)
  router.post('/', requireRole('ADMIN'), (req, res) => {
    const result = CreateShiftSchema.safeParse(req.body)
    if (!result.success) {
      sendValidationError(res, result.error)
      return
    }
    const shift: Shift = { id: nextId++, ...result.data, status: 'OPEN', assignedTo: null }
    shifts.push(shift)
    res.status(201).json(shift)
  })

  // POST /api/shifts/:id/claim   (STAFF only)  OPEN -> ASSIGNED
  router.post('/:id/claim', requireRole('STAFF'), (req, res) => {
    const user = res.locals.user as User
    const shift = findShift(req.params.id)
    if (!shift) {
      sendNotFound(res, 'Shift')
      return
    }
    if (shift.status !== 'OPEN') {
      res.status(409).json({ error: 'Shift is not open' })
      return
    }
    if (shifts.some((s) => s.assignedTo === user.id && s.date === shift.date)) {
      res.status(409).json({ error: 'You already have a shift that day' })
      return
    }
    shift.status = 'ASSIGNED'
    shift.assignedTo = user.id
    res.json(shift)
  })

  // POST /api/shifts/:id/complete   (ADMIN only)  ASSIGNED -> COMPLETED
  router.post('/:id/complete', requireRole('ADMIN'), (req, res) => {
    const shift = findShift(req.params.id)
    if (!shift) {
      sendNotFound(res, 'Shift')
      return
    }
    if (shift.status !== 'ASSIGNED') {
      res.status(409).json({ error: 'Only assigned shifts can be completed' })
      return
    }
    shift.status = 'COMPLETED'
    res.json(shift)
  })

  // DELETE /api/shifts/:id   (ADMIN only, OPEN shifts only)
  router.delete('/:id', requireRole('ADMIN'), (req, res) => {
    const shift = findShift(req.params.id)
    if (!shift) {
      sendNotFound(res, 'Shift')
      return
    }
    if (shift.status !== 'OPEN') {
      res.status(409).json({ error: 'Only open shifts can be deleted' })
      return
    }
    shifts.splice(shifts.indexOf(shift), 1)
    res.status(204).end()
  })

  return router
}
