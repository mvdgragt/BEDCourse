import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app'
import { ShiftPageSchema, ShiftSchema } from '../src/shifts'

let app: ReturnType<typeof createApp>
beforeEach(() => {
  app = createApp()
})

const admin = { 'x-role': 'ADMIN', 'x-user-id': '1' }
const staff = (id: number) => ({ 'x-role': 'STAFF', 'x-user-id': String(id) })
const newShift = { date: '2027-01-02', start: '10:00', end: '18:00', position: 'WAITER' }

// ---------- H1: Who is allowed to do what? ----------
describe('H1 · authentication (401) and permissions (403)', () => {
  it.each([
    ['no headers', {}],
    ['unknown role', { 'x-role': 'CHEF', 'x-user-id': '1' }],
    ['missing user id', { 'x-role': 'ADMIN' }],
    ['user id is not a number', { 'x-role': 'STAFF', 'x-user-id': 'abc' }],
  ])('GET /api/shifts with %s → 401', async (_label, headers) => {
    await request(app).get('/api/shifts').set(headers).expect(401)
  })

  it.each([
    ['POST', '/api/shifts', staff(4), 403],
    ['POST', '/api/shifts', admin, 201],
    ['POST', '/api/shifts/1/claim', admin, 403],
    ['POST', '/api/shifts/1/claim', staff(4), 200],
    ['POST', '/api/shifts/2/complete', staff(2), 403],
    ['POST', '/api/shifts/2/complete', admin, 200],
    ['DELETE', '/api/shifts/1', staff(4), 403],
    ['DELETE', '/api/shifts/1', admin, 204],
  ] as const)('%s %s as %o → %i', async (method, url, headers, expected) => {
    const req = method === 'POST' ? request(app).post(url).send(newShift) : request(app).delete(url)
    await req.set(headers).expect(expected)
  })

  it('401 comes before 404: no headers on an unknown shift is still 401', async () => {
    await request(app).get('/api/shifts/99').expect(401)
  })
})

// ---------- H2: The shift life cycle ----------
describe('H2 · OPEN → ASSIGNED → COMPLETED', () => {
  it('full journey: admin creates, staff claims, admin completes', async () => {
    const created = await request(app).post('/api/shifts').set(admin).send(newShift).expect(201)
    expect(ShiftSchema.parse(created.body)).toMatchObject({ status: 'OPEN', assignedTo: null })
    const id = created.body.id

    const claimed = await request(app).post(`/api/shifts/${id}/claim`).set(staff(4)).expect(200)
    expect(claimed.body).toMatchObject({ status: 'ASSIGNED', assignedTo: 4 })

    const done = await request(app).post(`/api/shifts/${id}/complete`).set(admin).expect(200)
    expect(done.body.status).toBe('COMPLETED')
  })

  it('two staff race for one shift: first wins, second gets 409', async () => {
    await request(app).post('/api/shifts/4/claim').set(staff(4)).expect(200)
    await request(app).post('/api/shifts/4/claim').set(staff(5)).expect(409)
  })

  it('a staff member cannot take two shifts on the same day', async () => {
    // user 2 already works shift 2 on 2026-12-24
    await request(app).post('/api/shifts/1/claim').set(staff(2)).expect(409)
    // ...but can take a shift on another day
    await request(app).post('/api/shifts/4/claim').set(staff(2)).expect(200)
  })

  it.each([
    ['complete an OPEN shift', 'post', '/api/shifts/1/complete'],
    ['complete a COMPLETED shift', 'post', '/api/shifts/5/complete'],
    ['claim a COMPLETED shift', 'post', '/api/shifts/5/claim'],
    ['delete an ASSIGNED shift', 'delete', '/api/shifts/2'],
  ] as const)('illegal move: %s → 409', async (_label, method, url) => {
    const headers = url.endsWith('/claim') ? staff(9) : admin
    await request(app)[method](url).set(headers).expect(409)
  })

  it('a deleted shift is gone', async () => {
    await request(app).delete('/api/shifts/3').set(admin).expect(204)
    await request(app).get('/api/shifts/3').set(admin).expect(404)
  })
})

// ---------- H3: Bug hunt (these tests FAIL on the starter code) ----------
describe('H3 · bug hunt: test the spec, not the code', () => {
  it('BUG 1 · page 1 returns the first 5 shifts', async () => {
    const res = await request(app).get('/api/shifts').set(admin).expect(200)
    const page = ShiftPageSchema.parse(res.body)
    expect(page.data.map((s) => s.id)).toEqual([1, 2, 3, 4, 5])
  })

  it('BUG 1 · page 2 returns the rest', async () => {
    const res = await request(app).get('/api/shifts?page=2').set(admin)
    expect(res.body.data.map((s: { id: number }) => s.id)).toEqual([6, 7])
  })

  it('BUG 2 · total counts only the filtered shifts', async () => {
    const res = await request(app).get('/api/shifts?status=OPEN').set(admin)
    expect(res.body.total).toBe(5)
  })

  it('BUG 3 · a shift that ends when it starts is rejected', async () => {
    const res = await request(app).post('/api/shifts').set(admin).send({ ...newShift, start: '10:00', end: '10:00' })
    expect(res.status).toBe(400)
    expect(res.body.issues).toHaveProperty('end')
  })

  it('not a bug: end before start is rejected', async () => {
    await request(app).post('/api/shifts').set(admin).send({ ...newShift, start: '18:00', end: '10:00' }).expect(400)
  })
})
