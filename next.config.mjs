/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**', // Allows any path under this hostname
      },
    ],
  },
  transpilePackages: ['@yourorg/ui'],
  // Add other Next.js configurations here if needed
};

export default nextConfig; 