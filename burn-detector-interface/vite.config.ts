import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    allowedHosts: ['burn-ia.local'],
    host: '0.0.0.0',  // opcional, útil si accedes desde otras máquinas
    port: 5173        // tu puerto actual
  },
});


