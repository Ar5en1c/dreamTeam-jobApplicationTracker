import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest';
import path from 'path';

export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@jobtracker/design-system': path.resolve(
        __dirname,
        '../packages/design-system/src/index.ts'
      ),
      '@jobtracker/ui': path.resolve(__dirname, '../packages/ui/src/index.ts'),
      '@jobtracker/ui/components': path.resolve(
        __dirname,
        '../packages/ui/src'
      ),
      '@jobtracker/types': path.resolve(
        __dirname,
        '../web-app/src/types/index.ts'
      ),
      '@jobtracker/database': path.resolve(
        __dirname,
        '../web-app/src/types/database.ts'
      ),
      '@jobtracker/styles': path.resolve(
        __dirname,
        '../web-app/src/styles'
      ),
      '@shared': path.resolve(__dirname, 'src/shared'),
      'class-variance-authority': path.resolve(
        __dirname,
        '../web-app/node_modules/class-variance-authority/dist/index.mjs'
      ),
      clsx: path.resolve(
        __dirname,
        '../web-app/node_modules/clsx/dist/clsx.mjs'
      ),
      'tailwind-merge': path.resolve(
        __dirname,
        '../web-app/node_modules/tailwind-merge/dist/bundle-mjs.mjs'
      )
    }
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')]
    }
  },
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js')
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
