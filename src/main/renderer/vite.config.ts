import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: ".",
  build: { 
    outDir: 'dist', // folder to dump final output
    emptyOutDir: true, // clean it before each build
    sourcemap: true,
    rollupOptions: {
      input: './src/main.tsx', // entry file
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // this makes `@` point to the `src` folder
    },
  },
})
