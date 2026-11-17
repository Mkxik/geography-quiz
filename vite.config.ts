import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so the build works on GitHub Pages (/geography-quiz/) and locally; routing uses HashRouter.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
