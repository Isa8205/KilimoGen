import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: path.resolve(__dirname, '../../../dist/main/renderer'),
    emptyOutDir: true,
  },
  plugins: [
    react(),
    visualizer({ filename: 'stats.html', open: false })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // this makes `@` point to the `src` folder
    },
  },
})
