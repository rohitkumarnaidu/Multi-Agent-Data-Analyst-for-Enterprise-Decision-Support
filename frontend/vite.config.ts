import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/echarts')) {
            return 'vendor-echarts'
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@xyflow')) {
            return 'vendor-xyflow'
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-tanstack'
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
    host: true,
  },
})
