/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  serverExternalPackages: ['mysql2'],

  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'framer-motion'],
  },
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  compress: true,

};

export default nextConfig;