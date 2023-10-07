import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://chat-app-api-tvkc.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
