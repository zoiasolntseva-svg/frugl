import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // This project lives in a OneDrive-synced folder; OneDrive's cloud file
    // sync intermittently corrupts Turbopack's persistent cache (os error 426),
    // causing builds/dev server crashes. Disable it so builds are slower but reliable.
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
