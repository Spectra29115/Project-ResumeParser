// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Use port 5173 locally to avoid clashing with services like SearXNG that
// commonly bind to 8080. In the Lovable sandbox, the config's own sandbox
// detection overrides this with the required port/host.
export default defineConfig({
  vite: {
    server: { host: "127.0.0.1", port: 5173, strictPort: false },
    preview: { host: "127.0.0.1", port: 5173, strictPort: false },
  },
});
