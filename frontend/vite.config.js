import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'jackets-band-flight-chat.trycloudflare.com', // your backend tunnel
    ],
    port: 5173,
  },
});
