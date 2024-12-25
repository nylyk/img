import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      '/api': 'http://img-backend-dev:3000',
    },
  },
  plugins: [react()],
});
