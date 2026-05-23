import { startServer } from '@tanstack/start/server'
import { getRouter } from './router'

export default startServer({
  router: getRouter(),
})
