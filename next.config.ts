import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit source maps for production bundles so debugging and Lighthouse insights work.
  // Note: This exposes source code in production builds. If you prefer limiting exposure,
  // consider gating this with an env check (e.g., only on preview environments).
  productionBrowserSourceMaps: true,
};

export default nextConfig;
