// ---------------------------------------------------------------
// MEDIUM: Table bookings API  –  /api/bookings
// ---------------------------------------------------------------
import { Router } from 'express'
import { z } from 'zod'
import { IdSchema, sendNotFound, sendValidationError } from './validation'

export const TIME_SLOTS = ['17:00', '19:00', '21:00'] as const

const partySize = z.number().int().min(1, 'At least 1 guest').max(8, 'At most 8 guests')
const time = z.enum(TIME_SLOTS, 'Time must be 17:00, 19:00 or 21:00')
const tableId = z.number().int().min(1, 'Tables are 1–5').max(5, 'Tables are 1–5')

// What we ACCEPT when creating
export const CreateBookingSchema = z.object({
  guestName: z.string().trim().min(1, 'Guest name is required'),
  partySize,
  date: z.iso.date('Date must be YYYY-MM-DD'),
  time,
  tableId,
})

// What we ACCEPT when updating: every field optional
export const UpdateBookingSchema = z.object({ partySize, time, tableId }).partial()

export const BookingStatusSchema = z.enum(['CONFIRMED', 'CANCELLED'])

// What we PROMISE
export const BookingSchema = CreateBookingSchema.extend({
  id: z.number().int().positive(),
  status: BookingStatusSchema,
})

export type Booking = z.infer<typeof BookingSchema>

const BookingQuerySchema = z.object({
  date: z.iso.date('Date must be YYYY-MM-DD').optional(),
})

export const bookingsRouter = () => {
  const router = Router()

  const bookings: Booking[] = [
    { id: 1, guestName: 'Andersson', partySize: 4, date: '2026-12-24', time: '19:00', tableId: 2, status: 'CONFIRMED' },
    { id: 2, guestName: 'Lind', partySize: 2, date: '2026-12-24', time: '17:00', tableId: 1, status: 'CONFIRMED' },
    { id: 3, guestName: 'Nilsson', partySize: 6, date: '2026-12-31', time: '21:00', tableId: 5, status: 'CANCELLED' },
  ]
  let nextId = 4

  // Is this table already taken at this date and time? (cancelled bookings don't count)
  const isTaken = (slot: Pick<Booking, 'date' | 'time' | 'tableId'>, ignoreId?: number) =>
    bookings.some(
      (b) =>
        b.status === 'CONFIRMED' &&
        b.id !== ignoreId &&
        b.date === slot.date &&
        b.time === slot.time &&
        b.tableId === slot.tableId,
    )

  const findBooking = (rawId: unknown) => {
    const id = IdSchema.safeParse(rawId)
    return id.success ? bookings.find((b) => b.id === id.data) : undefined
  }

  // GET /api/bookings?date=2026-12-24
  router.get('/', (req, res) => {
    const query = BookingQuerySchema.safeParse(req.query)
    if (!query.success) {
      sendValidationError(res, query.error)
      return
    }
    const { date } = query.data
    res.json(bookings.filter((b) => date === undefined || b.date === date))
  })

  // GET /api/bookings/:id
  router.get('/:id', (req, res) => {
    const booking = findBooking(req.params.id)
    if (!booking) {
      sendNotFound(res, 'Booking')
      return
    }
    res.json(booking)
  })

  // POST /api/bookings
  router.post('/', (req, res) => {
    const result = CreateBookingSchema.safeParse(req.body)
    if (!result.success) {
      sendValidationError(res, result.error)
      return
    }
    if (isTaken(result.data)) {
      res.status(409).json({ error: 'That table is already booked at that time' })
      return
    }
    const booking: Booking = { id: nextId++, ...result.data, status: 'CONFIRMED' }
    bookings.push(booking)
    res.status(201).json(booking)
  })

  // PATCH /api/bookings/:id   – change partySize, time and/or tableId
  router.patch('/:id', (req, res) => {
    const booking = findBooking(req.params.id)
    if (!booking) {
      sendNotFound(res, 'Booking')
      return
    }
    const result = UpdateBookingSchema.safeParse(req.body)
    if (!result.success) {
      sendValidationError(res, result.error)
      return
    }
    if (Object.keys(result.data).length === 0) {
      res.status(400).json({ error: 'Nothing to update' })
      return
    }
    if (booking.status === 'CANCELLED') {
      res.status(409).json({ error: 'A cancelled booking cannot be changed' })
      return
    }
    const updated = { ...booking, ...result.data }
    if (isTaken(updated, booking.id)) {
      res.status(409).json({ error: 'That table is already booked at that time' })
      return
    }
    Object.assign(booking, result.data)
    res.json(booking)
  })

  // POST /api/bookings/:id/cancel
  router.post('/:id/cancel', (req, res) => {
    const booking = findBooking(req.params.id)
    if (!booking) {
      sendNotFound(res, 'Booking')
      return
    }
    if (booking.status === 'CANCELLED') {
      res.status(409).json({ error: 'Booking is already cancelled' })
      return
    }
    booking.status = 'CANCELLED'
    res.json(booking)
  })

  return router
}
