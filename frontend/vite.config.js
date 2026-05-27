import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Rolldown strictly requires a function here in Vite 8
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('mapbox-gl') || id.includes('@turf')) {
              return 'vendor-maps';
            }
            if (id.includes('react') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            return 'vendor-core'; // Baki saare teesre dependencies ke liye
          }
        },
      },
    },
  },
});