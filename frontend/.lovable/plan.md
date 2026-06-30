## Diagnosis

Vite starts cleanly on `http://localhost:5173`, but every request returns 404. The router and `routeTree.gen.ts` are fine (the app works in the Lovable preview), so this isn't a route-file problem.

The cause is in `vite.config.ts`:

```ts
tanstackStart: {
  server: { entry: "server" }, // points Nitro at src/server.ts
}
```

`src/server.ts` is a custom SSR wrapper that exists only so the **sandbox/Cloudflare Worker build** can intercept catastrophic SSR errors and render a friendly fallback. It re-imports `@tanstack/react-start/server-entry` lazily.

In a normal local `vite dev` run on Node, this override hijacks the dev SSR handler too. The wrapper's dynamic import + Worker-shaped `fetch(request, env, ctx)` signature doesn't match what the Node dev middleware expects, so every request falls through to a generic 404 from the dev server.

The Lovable preview doesn't show this because it runs the production-style Worker build where the wrapper is the correct entry.

## Fix

1. **Remove the `server.entry` override from `vite.config.ts`** so dev (and the standard build) use TanStack Start's built-in server entry:

   ```ts
   import { defineConfig } from "@lovable.dev/vite-tanstack-config";

   export default defineConfig({});
   ```

2. **Keep `src/server.ts` in the repo** (the Lovable sandbox build still uses it via its own config layer), but it no longer participates in local dev.

3. **Verify locally:**
   ```bash
   npm run dev
   # open http://localhost:5173/  -> landing page renders
   # navigate to /jobs, /recruiter/login -> all routes work
   ```

If after the change you still see 404, do a clean reinstall (`rm -rf node_modules src/routeTree.gen.ts && npm install && npm run dev`) so the router plugin regenerates the route tree against the freshly installed `@tanstack/react-router` version.

## Technical notes

- `@lovable.dev/vite-tanstack-config` already wires `tanstackStart`, `viteReact`, `tailwindcss`, `tsConfigPaths`, and Nitro with Cloudflare as the build target. We don't need to re-specify any of these.
- The `defineConfig({})` call still accepts a `vite: { ... }` block if you later need to add aliases, proxies, or server options for local dev.
- No route files, no `routeTree.gen.ts`, and no application code need to change.
