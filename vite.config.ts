import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`      -> map dist/ om online te zetten (statische hosting)
// `npm run build:deel` -> één enkel HTML-bestand in deel/ om door te geven aan andere ouders
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: mode === 'deel' ? [react(), viteSingleFile()] : [react()],
  build: {
    outDir: mode === 'deel' ? 'deel' : 'dist',
    emptyOutDir: true,
  },
  server: { port: 5173 },
}));
