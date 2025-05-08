import react from "@vitejs/plugin-react-swc";
import type { IncomingMessage, ServerResponse } from "http";
import path from "path";
import { defineConfig } from "vite";

function configureServer(server: any) {
  server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: any) => {
    if (req.url === "/manifest.json") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With, content-type, Authorization",
      );
      res.setHeader("X-Frame-Options", "ALLOW-FROM https://*.safe.global https://*.gnosis-safe.io");
    }
    next();
  });
}
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    {
      name: "configure-server",
      configureServer,
    },
  ],
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      "X-Frame-Options": "ALLOW-FROM https://*.safe.global https://*.gnosis-safe.io",
    },
  },
});
