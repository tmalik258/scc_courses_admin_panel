import type { NextConfig } from "next";
// import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@supabase/ssr"],

  // Webpack configuration to handle memory leaks
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Increase max listeners for server-side rendering
      config.externals = config.externals || [];
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      });
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nflffbbhnctgdaeyyfeq.supabase.co",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
