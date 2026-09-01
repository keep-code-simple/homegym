import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // Relative base so dist/ works from any path, including file:// on a tablet.
  base: './',
  build: {
    // Fonts and everything else must be local files; never inline to a data URI
    // so large the first paint suffers on a slow tablet.
    assetsInlineLimit: 4096,
  },
})
