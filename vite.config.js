import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile";

// `vite build --mode standalone` produces one self-contained HTML file that
// runs when opened straight from disk, no server or Node.js needed.
export default defineConfig(({ mode }) => ({
  server: { host: "::", port: 8080 },
  plugins: [react(), ...(mode === "standalone" ? [viteSingleFile()] : [])],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  ...(mode === "standalone" && {
    base: "./",
    publicDir: false,
    build: { outDir: "standalone", assetsInlineLimit: 100_000_000, chunkSizeWarningLimit: 5000 },
  }),
}));
