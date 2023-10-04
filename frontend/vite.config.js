import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://chat-app-1-production.up.railway.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
