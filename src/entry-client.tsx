import { startClient } from '@tanstack/start'
import { getRouter } from './router'

startClient({
  router: getRouter(),
})
