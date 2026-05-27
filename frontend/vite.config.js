import {  defineConfig} from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit:
      2000,
    rollupOptions: {
      output: {
        manualChunks: {
          mapbox: [
            "mapbox-gl",
          ],
          socket: [
            "socket.io-client",
          ],
          turf: [
            "@turf/turf",
          ],
        },
      },
    },
  },
});