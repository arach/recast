/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const isCustomDomain = process.env.CUSTOM_DOMAIN === 'true'

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Use /recast base path for github.io, no base path for custom domain
  basePath: isProd && !isCustomDomain ? '/recast' : '',
  assetPrefix: isProd && !isCustomDomain ? '/recast/' : '/',
}

module.exports = nextConfig