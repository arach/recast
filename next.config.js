/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Improve HMR reliability
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slider'],
  },
  // Turbopack configuration (stable)
  turbopack: {
    rules: {
      '*.svg': ['@svgr/webpack'],
    },
  },
  // Development optimizations
  env: {
    TURBOPACK: '1',
  },
}

module.exports = nextConfig