import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If you plan to host on GitHub Pages under a subpath, set BASE_PATH when building.
// Use a relative base by default so the built app works when served from a subpath
// or from the file system. CI / GitHub Actions can still set BASE_PATH to
// '/<repo>/' to force an absolute base when needed.
const base = process.env.BASE_PATH || './'

export default defineConfig({
  base,
  plugins: [react()]
})
