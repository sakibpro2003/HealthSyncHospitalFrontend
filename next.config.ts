/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "onemg.gumlet.io",
      },
      {
        protocol: "https",
        hostname: "emami-production-2.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "5.imimg.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "images.apollo247.in",
      },
      {
        protocol: "https",
        hostname: "samirahan.com.bd",
      },
      {
        protocol: "https",
        hostname: "cdn2.arogga.com",
      },
      {
        protocol: "https",
        hostname: "medex.com.bd",
      },
      {
        protocol: "https",
        hostname: "naturesway.com",
      },
      {
        protocol: "https",
        hostname: "www.squarehospital.com",
      },
      {
        protocol: "https",
        hostname: "squarehospital.com",
      },
    ],
  },
};

module.exports = nextConfig;
