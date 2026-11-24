import express from 'express'
import { menuRouter } from './menu'
import { bookingsRouter } from './bookings'
import { shiftsRouter } from './shifts'

// Factory: every call gives a brand-new app with fresh data
export const createApp = () => {
  const app = express()
  app.use(express.json())

  app.use('/api/menu', menuRouter())
  app.use('/api/bookings', bookingsRouter())
  app.use('/api/shifts', shiftsRouter())

  return app
}
