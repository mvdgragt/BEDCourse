import { beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { z } from 'zod'
import { createApp } from '../src/app'
import { DishSchema } from '../src/menu'

let app: ReturnType<typeof createApp>
beforeEach(() => {
  app = createApp()
})

const meatballs = { name: 'Swedish Meatballs', price: 210, category: 'MAIN' }

// ---------- E1: Reading the menu ----------
describe('E1 · GET /api/menu', () => {
  it('returns all four dishes in the promised shape', async () => {
    const res = await request(app).get('/api/menu')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(4)
    expect(() => z.array(DishSchema).parse(res.body)).not.toThrow()
  })

  it('returns one dish by id', async () => {
    const res = await request(app).get('/api/menu/4')
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Cloudberry Parfait')
  })

  it.each(['99', 'abc', '0', '-1', '1.5'])('returns 404 for id "%s"', async (id) => {
    await request(app).get(`/api/menu/${id}`).expect(404)
  })
})

// ---------- E2: Adding a dish ----------
describe('E2 · POST /api/menu', () => {
  it('creates a dish with id 5 and vegetarian false by default', async () => {
    const res = await request(app).post('/api/menu').send(meatballs)
    expect(res.status).toBe(201)
    expect(res.body).toEqual({ id: 5, ...meatballs, vegetarian: false })
  })

  it('the new dish shows up in the list', async () => {
    await request(app).post('/api/menu').send(meatballs).expect(201)
    const res = await request(app).get('/api/menu')
    expect(res.body).toHaveLength(5)
  })

  it.each([
    ['price is negative', { ...meatballs, price: -10 }, 'price'],
    ['price is a string', { ...meatballs, price: '210' }, 'price'],
    ['price has decimals', { ...meatballs, price: 209.5 }, 'price'],
    ['price is too high', { ...meatballs, price: 1001 }, 'price'],
    ['name is only spaces', { ...meatballs, name: '   ' }, 'name'],
    ['category is unknown', { ...meatballs, category: 'SNACK' }, 'category'],
  ])('rejects with 400 when %s', async (_label, body, field) => {
    const res = await request(app).post('/api/menu').send(body)
    expect(res.status).toBe(400)
    expect(res.body.issues).toHaveProperty(field)
  })

  it('accepts the boundary price 1000', async () => {
    await request(app).post('/api/menu').send({ ...meatballs, price: 1000 }).expect(201)
  })
})

// ---------- E3: Filtering ----------
describe('E3 · GET /api/menu with filters', () => {
  it('filters by category', async () => {
    const res = await request(app).get('/api/menu?category=MAIN')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body.every((d: { category: string }) => d.category === 'MAIN')).toBe(true)
  })

  it('filters by vegetarian', async () => {
    const res = await request(app).get('/api/menu?vegetarian=true')
    expect(res.body.map((d: { id: number }) => d.id)).toEqual([3, 4])
  })

  it('combines filters', async () => {
    const res = await request(app).get('/api/menu?category=MAIN&vegetarian=false')
    expect(res.body).toHaveLength(1)
    expect(res.body[0].name).toBe('Grilled Arctic Char')
  })

  it('returns an empty list, not 404, when nothing matches', async () => {
    const res = await request(app).get('/api/menu?category=STARTER&vegetarian=true')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it.each(['category=SNACK', 'vegetarian=yes'])('rejects invalid filter %s with 400', async (q) => {
    await request(app).get(`/api/menu?${q}`).expect(400)
  })
})
