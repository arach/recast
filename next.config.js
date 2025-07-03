const crypto = require('crypto');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/favicon.ico',
      },
    ],
  },
  // Optimize package imports for faster builds
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-slider',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tooltip',
      'better-auth',
    ],
  },
  
  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Handle better-sqlite3 native module
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('better-sqlite3');
    }
    
    // Monaco Editor configuration
    if (!isServer) {
      // Add fallback for node modules that Monaco might need
      config.resolve.fallback = {
        ...config.resolve.fallback,
        path: false,
        fs: false,
      };
      
      // Configure webpack for Monaco Editor
      config.module.rules.push({
        test: /\.ttf$/,
        type: 'asset/resource',
      });
      
      // Ensure Monaco Editor chunks are properly generated
      config.output.publicPath = '/_next/';
      
      // Add cache groups for Monaco
      config.optimization.splitChunks = config.optimization.splitChunks || {};
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        monaco: {
          test: /[\\/]node_modules[\\/]monaco-editor/,
          name: 'monaco-editor',
          priority: 50,
          chunks: 'all',
        },
      };
    }
    
    // Development optimizations
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next', '**/dist'],
      };
    }
    
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module) {
                return module.size() > 160000 &&
                  /node_modules[/\\]/.test(module.identifier());
              },
              name(module) {
                const hash = crypto.createHash('sha1');
                hash.update(module.identifier());
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name(module, chunks) {
                return crypto
                  .createHash('sha1')
                  .update(chunks.reduce((acc, chunk) => acc + chunk.name, ''))
                  .digest('hex')
                  .substring(0, 8);
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },
}

module.exports = nextConfig