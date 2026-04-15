import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: для GitHub Pages нужно '/test-portfolio/' (имя репо).
// Настраивается в Phase 7 (Deploy). Пока '/' для dev.
export default defineConfig({
  plugins: [react()],
  base: '/',
});
