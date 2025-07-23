import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  // },
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.externals.push('@prisma/client')
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
