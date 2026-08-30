import path from "node:path";
import type { NextConfig } from "next";

// Note: backend proxying is handled by `src/app/api/backend/[...path]/route.ts`
// so streaming SSE responses aren't buffered. Don't add a `rewrites()` rule
// here for `/api/backend/*` — it would re-introduce buffering.
const nextConfig: NextConfig = {
  // Standalone output is for the Docker image (`node server.js` without
  // node_modules). Vercel manages its own output — standalone breaks its
  // build — so only emit it outside Vercel.
  ...(process.env.VERCEL
    ? {}
    : {
        output: "standalone" as const,
        // Pin the file-tracing root to this package so the standalone output
        // lands at `.next/standalone/server.js`. Without this, Next walks up
        // looking for a workspace root and nests server.js many directories deep.
        outputFileTracingRoot: path.resolve(__dirname),
      }),
  // mermaid v11 is ESM-only; Next.js webpack needs to transpile it
  transpilePackages: ["mermaid"],
};

export default nextConfig;
