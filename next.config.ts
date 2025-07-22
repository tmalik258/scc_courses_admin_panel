import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
};

export default nextConfig;
