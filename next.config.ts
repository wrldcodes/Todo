import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: './',
  },
  experimental: {
    cacheComponents: true,
    
  },
};

export default nextConfig;
