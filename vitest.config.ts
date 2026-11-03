import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
    setupFiles: ["./tests/unit/setup.ts"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
