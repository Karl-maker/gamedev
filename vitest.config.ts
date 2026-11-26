import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: projectRoot,
  test: { environment: "jsdom", setupFiles: [path.join(projectRoot, "src/test/setup.ts")], globals: true },
  resolve: { alias: { "@": path.join(projectRoot, "src") } }
});
