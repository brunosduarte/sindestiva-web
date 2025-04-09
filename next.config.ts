import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'exemplo.com',
      'images.unsplash.com',
      'picsum.photos',
      'via.placeholder.com',
      'sindestiva.com.br',
      'estivadoresriogrande.org.br',
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
