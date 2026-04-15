import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages deploy: https://suvorovdv.github.io/test-portfolio/
  base: '/test-portfolio/',
});
