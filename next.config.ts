import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable HTTP compression for HTML and JSON responses served by Next.js
  compress: true,
  // Minor security hardening; also slightly reduces bytes on the wire
  poweredByHeader: false,
  // Avoid framework-added redirects that can add latency
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
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
  // Avoid URL normalization redirects in middleware (moved out of experimental)
  skipMiddlewareUrlNormalize: true,
  async headers() {
    return [
      {
        // Apply response headers to all routes
        source: "/:path*",
        headers: [
          // Help proxies/CDNs vary on compression
          { key: "Vary", value: "Accept-Encoding" },
          // Ensure quick revalidation while enabling intermediary caching
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
