import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: [
    "*.pit-1.try.coder.app",
    "*.try.coder.app",
  ],
};

export default nextConfig;
