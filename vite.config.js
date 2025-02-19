import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true,  // Allows access from all IPs
    port: 5173,  // Ensures the app runs on this port
    strictPort: true,  // Prevents switching to another port
    cors: true,  // Enables CORS
    allowedHosts:true, // Allow this host
  },
});
