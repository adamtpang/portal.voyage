import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // The parent Aether/ folder has its own lockfile; pin the tracing root to
  // this project so Next doesn't infer the parent as the workspace root.
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
