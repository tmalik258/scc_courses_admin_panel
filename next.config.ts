import type { NextConfig } from "next";
// import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  // },
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     // Ensure that all imports of 'yjs' resolve to the same instance
  //     config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs')
  //   }
  //   return config
  // },
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
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
