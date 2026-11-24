// MEDIUM · Bookings API · Tasks M1, M2, M3
import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app'
import { BookingSchema } from '../src/bookings'

let app: ReturnType<typeof createApp>
beforeEach(() => {
  app = createApp()
})

describe('M1 · POST /api/bookings', () => {
  it.todo('creates a CONFIRMED booking')
})

describe('M2 · double bookings and cancelling', () => {
  it.todo('rejects a double booking with 409')
})

describe('M3 · PATCH /api/bookings/:id', () => {
  it.todo('changes only the fields that were sent')
})
