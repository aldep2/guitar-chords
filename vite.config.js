import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If you plan to host on GitHub Pages under a subpath, set BASE_PATH when building
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react()]
})
