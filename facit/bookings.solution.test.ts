import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app'
import { BookingSchema } from '../src/bookings'

let app: ReturnType<typeof createApp>
beforeEach(() => {
  app = createApp()
})

const berg = { guestName: 'Berg', partySize: 3, date: '2026-12-24', time: '21:00', tableId: 3 }

// ---------- M1: Creating bookings and boundary values ----------
describe('M1 · POST /api/bookings', () => {
  it('creates a CONFIRMED booking with id 4', async () => {
    const res = await request(app).post('/api/bookings').send(berg)
    expect(res.status).toBe(201)
    expect(BookingSchema.parse(res.body)).toEqual({ id: 4, ...berg, status: 'CONFIRMED' })
  })

  it.each([
    [0, 400],
    [1, 201],
    [8, 201],
    [9, 400],
  ])('partySize %i → %i', async (partySize, expected) => {
    await request(app).post('/api/bookings').send({ ...berg, partySize }).expect(expected)
  })

  it.each([
    ['date', '2026-13-40'],
    ['date', '24/12/2026'],
    ['time', '18:00'],
    ['tableId', 6],
    ['tableId', 0],
    ['guestName', ''],
  ])('rejects invalid %s (%s) with 400', async (field, value) => {
    const res = await request(app).post('/api/bookings').send({ ...berg, [field]: value })
    expect(res.status).toBe(400)
    expect(res.body.issues).toHaveProperty(field)
  })

  it('filters the list by date', async () => {
    const res = await request(app).get('/api/bookings?date=2026-12-24')
    expect(res.body.map((b: { id: number }) => b.id)).toEqual([1, 2])
  })
})

// ---------- M2: Business rules ----------
describe('M2 · double bookings and cancelling', () => {
  const sameSlotAsAndersson = { ...berg, date: '2026-12-24', time: '19:00', tableId: 2 }

  it('rejects a double booking with 409', async () => {
    await request(app).post('/api/bookings').send(sameSlotAsAndersson).expect(409)
  })

  it('allows the same table at another time', async () => {
    await request(app).post('/api/bookings').send({ ...sameSlotAsAndersson, time: '21:00' }).expect(201)
  })

  it('allows a slot that belonged to a cancelled booking (Nilsson)', async () => {
    await request(app)
      .post('/api/bookings')
      .send({ ...berg, date: '2026-12-31', time: '21:00', tableId: 5 })
      .expect(201)
  })

  it('cancel → slot free again → rebook works', async () => {
    const cancelled = await request(app).post('/api/bookings/1/cancel').expect(200)
    expect(cancelled.body.status).toBe('CANCELLED')
    await request(app).post('/api/bookings').send(sameSlotAsAndersson).expect(201)
  })

  it('cancelling twice gives 409', async () => {
    await request(app).post('/api/bookings/1/cancel').expect(200)
    await request(app).post('/api/bookings/1/cancel').expect(409)
  })

  it('cancelling an unknown booking gives 404', async () => {
    await request(app).post('/api/bookings/99/cancel').expect(404)
  })
})

// ---------- M3: PATCH ----------
describe('M3 · PATCH /api/bookings/:id', () => {
  it('changes only the fields that were sent', async () => {
    const res = await request(app).patch('/api/bookings/2').send({ partySize: 5 })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      id: 2, guestName: 'Lind', partySize: 5, date: '2026-12-24', time: '17:00', tableId: 1, status: 'CONFIRMED',
    })
  })

  it('the change is saved (GET shows it)', async () => {
    await request(app).patch('/api/bookings/2').send({ time: '21:00' }).expect(200)
    const res = await request(app).get('/api/bookings/2')
    expect(res.body.time).toBe('21:00')
  })

  it('moving into a taken slot gives 409 and changes nothing', async () => {
    // Lind (17:00, table 1) tries to move to Andersson's slot (19:00, table 2)
    await request(app).patch('/api/bookings/2').send({ time: '19:00', tableId: 2 }).expect(409)
    const res = await request(app).get('/api/bookings/2')
    expect(res.body).toMatchObject({ time: '17:00', tableId: 1 })
  })

  it('a booking does not conflict with itself', async () => {
    await request(app).patch('/api/bookings/1').send({ partySize: 2 }).expect(200)
  })

  it('an empty body gives 400', async () => {
    await request(app).patch('/api/bookings/1').send({}).expect(400)
  })

  it('invalid values give 400', async () => {
    const res = await request(app).patch('/api/bookings/1').send({ partySize: 20 })
    expect(res.status).toBe(400)
    expect(res.body.issues).toHaveProperty('partySize')
  })

  it('date and guestName cannot be changed (they are ignored)', async () => {
    await request(app).patch('/api/bookings/1').send({ guestName: 'Hacker', partySize: 3 }).expect(200)
    const res = await request(app).get('/api/bookings/1')
    expect(res.body.guestName).toBe('Andersson')
  })

  it('a cancelled booking cannot be changed (409)', async () => {
    await request(app).patch('/api/bookings/3').send({ partySize: 2 }).expect(409)
  })

  it('unknown id gives 404', async () => {
    await request(app).patch('/api/bookings/99').send({ partySize: 2 }).expect(404)
  })
})
