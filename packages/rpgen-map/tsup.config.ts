import { defineConfig } from "tsup";

export default defineConfig({
  target: "esnext",
  entry: ["src/**/*.ts"],
  platform: "neutral",
  format: "esm",
  clean: true,
  dts: true,
});
