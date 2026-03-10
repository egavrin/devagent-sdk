import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@devagent-sdk/changelog": fileURLToPath(new URL("./packages/changelog/src/index.ts", import.meta.url)),
      "@devagent-sdk/schema": fileURLToPath(new URL("./packages/schema/src/index.ts", import.meta.url)),
      "@devagent-sdk/types": fileURLToPath(new URL("./packages/types/src/index.ts", import.meta.url)),
      "@devagent-sdk/validation": fileURLToPath(new URL("./packages/validation/src/index.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["packages/*/src/**/*.test.ts"],
  },
});
