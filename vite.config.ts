/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// User site: https://lexeraapp.github.io/ (repository lexeraapp/lexeraapp.github.io), served from the root
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: { target: "es2022", sourcemap: false },
  test: { environment: "node", include: ["src/**/*.test.{ts,tsx}"] },
});
