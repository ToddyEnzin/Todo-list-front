import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O backend libera CORS para http://localhost:5173 (porta padrão do Vite).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
