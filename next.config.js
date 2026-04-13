/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react'],
  },
}

module.exports = nextConfig
