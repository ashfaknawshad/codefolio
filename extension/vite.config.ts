// extension/vite.config.ts

import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // --- ADD THIS ENTIRE 'build' SECTION ---
  build: {
    rollupOptions: {
      input: {
        // This is your popup page
        main: path.resolve(__dirname, 'index.html'),
        // This is your options page
        options: path.resolve(__dirname, 'options.html'),
      },
    },
  },
})