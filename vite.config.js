import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" keeps every asset reference relative, so the built site works
// whether it's served from a domain root, a GitHub Pages project subpath, or
// opened straight from the filesystem. Routing uses a hash router for the same
// reason — no server-side rewrite rules required.
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: { port: 5190, strictPort: true },
  preview: { port: 5190, strictPort: true },
});
