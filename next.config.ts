import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "medeasy.health",
      "api.medeasy.health",
      "i.ibb.co",
      "images.unsplash.com","uhlbd.com"
    ],
    formats: ["image/webp"],
  },
};

export default nextConfig;
