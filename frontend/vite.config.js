import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    lib: {
      entry: resolve(__dirname, "src/lib/index.js"),
      name: "core-package",
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-router", "react-router-dom"],
      output: {
        globals: {
          react: "React",
        },
      },
    },
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
