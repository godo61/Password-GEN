import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Password-GEN/', // IMPORTANTE: Esto debe coincidir con el nombre de tu repositorio
  build: {
    outDir: 'dist',
  }
});