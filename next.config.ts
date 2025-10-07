import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduce JS payload and parsing cost in production
  productionBrowserSourceMaps: process.env.NODE_ENV !== "production",
  compiler: {
    // Remove console.* in production to shrink bundles
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // Optimize package imports for common libraries to minimize bundle size
    optimizePackageImports: ["lucide-react", "@clerk/nextjs"],
  },
};

export default nextConfig;
