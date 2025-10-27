
/** @type {import('next').NextConfig} */


// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});
module.exports = withPWA({
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.hm.com' },
      { protocol: 'https', hostname: 'static.zara.net' },
      // add other CDNs if needed
    ],
  },
});