/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  experimental: {
    // appDir is now enabled by default in Next.js 13+
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone', // Required for Docker deployment
};

export default nextConfig; 