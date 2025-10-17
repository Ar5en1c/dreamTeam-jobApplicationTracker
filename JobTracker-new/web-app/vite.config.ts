/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/dreamTeam-jobApplicationTracker/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@jobtracker/design-system': path.resolve(
        __dirname,
        '../packages/design-system/src'
      ),
      '@jobtracker/ui': path.resolve(__dirname, '../packages/ui/src'),
      'class-variance-authority': path.resolve(
        __dirname,
        './node_modules/class-variance-authority/dist/index.mjs'
      ),
      clsx: path.resolve(__dirname, './node_modules/clsx/dist/clsx.mjs'),
      'tailwind-merge': path.resolve(
        __dirname,
        './node_modules/tailwind-merge/dist/bundle-mjs.mjs'
      )
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')]
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
