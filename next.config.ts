import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**', // Allow any path starting with /u/ for user avatars
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
