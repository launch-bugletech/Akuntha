import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [".trycloudflare.com", "akunthaform.mehulsinhchauhan.me"],
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
});
