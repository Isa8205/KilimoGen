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
    // --- Add manualChunks for better code splitting ---
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and ReactDOM into a separate chunk
          react: ['react', 'react-dom'],
          // Split Recoil state management
          recoil: ['recoil'],
          // Split other heavy vendor libraries
          vendor: [
            'axios', 'fuse.js', 'framer-motion', 'recharts', 'styled-components',
            'date-fns', 'dayjs', 'react-toastify', 'lucide-react'
          ],
        },
      },
    },
    // --- End manualChunks ---
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
