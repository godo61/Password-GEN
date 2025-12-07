import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Usar base relativa permite que la app funcione bajo cualquier subdirectorio o nombre de repo
  base: './', 
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});