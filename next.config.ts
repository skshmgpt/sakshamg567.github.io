import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'], // Use modern image formats
    remotePatterns: [
      {
        protocol: "https",
        hostname: "miro.medium.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'], // Tree-shake lucide icons
  },
};

export default nextConfig;
