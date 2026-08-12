import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_API_BASE_URL points at the deployed Sekhmet backend in production
// (see .env.local for local dev). Vite's config file does NOT automatically
// populate process.env from .env files - that only happens for import.meta.env
// on the client side - so loadEnv() is required here to read it for the proxy.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  };
});
