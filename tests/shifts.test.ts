// HARD · Shifts API · Tasks H1, H2, H3
import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app'
import { ShiftPageSchema, ShiftSchema } from '../src/shifts'

let app: ReturnType<typeof createApp>
beforeEach(() => {
  app = createApp()
})

// Helpers: send these with .set(admin) or .set(staff(4))
const admin = { 'x-role': 'ADMIN', 'x-user-id': '1' }
const staff = (id: number) => ({ 'x-role': 'STAFF', 'x-user-id': String(id) })

describe('H1 · authentication (401) and permissions (403)', () => {
  it.todo('GET /api/shifts without headers returns 401')
})

describe('H2 · OPEN → ASSIGNED → COMPLETED', () => {
  it.todo('admin creates, staff claims, admin completes')
})

describe('H3 · bug hunt', () => {
  it.todo('write tests from the spec, not from the code')
})
