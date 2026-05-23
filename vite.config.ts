import { defineConfig } from 'vite'
import tsr from '@tanstack/start/vite'

export default defineConfig({
  plugins: [tsr()],
})
