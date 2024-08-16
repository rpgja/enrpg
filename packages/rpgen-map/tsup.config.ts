import { defineConfig } from "tsup";

export default defineConfig({
  target: "esnext",
  entry: ["src/**/*.ts", "!src/**/*.test.ts"],
  platform: "neutral",
  format: "esm",
  clean: true,
  sourcemap: true,
});
