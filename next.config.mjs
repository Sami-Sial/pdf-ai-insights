/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.MOBILE_BUILD ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  turbopack: {},
}
export default nextConfig
