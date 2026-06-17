import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Keep JS/CSS chunk references relative so the built HTML remains portable.
// App-rendered public assets use absolute /assets URLs via src/utils/assets.js.
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: { port: 5190, strictPort: true },
  preview: { port: 5190, strictPort: true },
});
