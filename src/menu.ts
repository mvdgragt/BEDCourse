// ---------------------------------------------------------------
// EASY: Menu API  –  /api/menu
// ---------------------------------------------------------------
import { Router } from 'express'
import { z } from 'zod'
import { IdSchema, sendNotFound, sendValidationError } from './validation'

export const CategorySchema = z.enum(['STARTER', 'MAIN', 'DESSERT'])

// What we ACCEPT
export const CreateDishSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  price: z.number().int('Price must be whole kronor').positive('Price must be above 0').max(1000, 'Price can be at most 1000'),
  category: CategorySchema,
  vegetarian: z.boolean().default(false),
})

// What we PROMISE
export const DishSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  price: z.number().int().positive(),
  category: CategorySchema,
  vegetarian: z.boolean(),
})

export type Dish = z.infer<typeof DishSchema>

// Query strings are always text, so "true"/"false" become booleans here
const MenuQuerySchema = z.object({
  category: CategorySchema.optional(),
  vegetarian: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
})

export const menuRouter = () => {
  const router = Router()

  const dishes: Dish[] = [
    { id: 1, name: 'Toast Skagen', price: 145, category: 'STARTER', vegetarian: false },
    { id: 2, name: 'Grilled Arctic Char', price: 295, category: 'MAIN', vegetarian: false },
    { id: 3, name: 'Mushroom Risotto', price: 245, category: 'MAIN', vegetarian: true },
    { id: 4, name: 'Cloudberry Parfait', price: 125, category: 'DESSERT', vegetarian: true },
  ]
  let nextId = 5

  // GET /api/menu?category=MAIN&vegetarian=true
  router.get('/', (req, res) => {
    const query = MenuQuerySchema.safeParse(req.query)
    if (!query.success) {
      sendValidationError(res, query.error)
      return
    }
    const { category, vegetarian } = query.data
    res.json(
      dishes.filter(
        (d) =>
          (category === undefined || d.category === category) &&
          (vegetarian === undefined || d.vegetarian === vegetarian),
      ),
    )
  })

  // GET /api/menu/:id
  router.get('/:id', (req, res) => {
    const id = IdSchema.safeParse(req.params.id)
    const dish = id.success ? dishes.find((d) => d.id === id.data) : undefined
    if (!dish) {
      sendNotFound(res, 'Dish')
      return
    }
    res.json(dish)
  })

  // POST /api/menu
  router.post('/', (req, res) => {
    const result = CreateDishSchema.safeParse(req.body)
    if (!result.success) {
      sendValidationError(res, result.error)
      return
    }
    const dish: Dish = { id: nextId++, ...result.data }
    dishes.push(dish)
    res.status(201).json(dish)
  })

  return router
}
