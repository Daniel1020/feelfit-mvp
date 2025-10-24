
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  }
};


const withPWA = require('next-pwa')({
  dest: 'public',
  disable: true,
});

module.exports = withPWA({
  reactStrictMode: true,
  // 不要对 "/" 做 rewrites/redirects
});