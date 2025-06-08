import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "medeasy.health", // ✅ Correct domain (no https://)
      "api.medeasy.health", // ✅ If you're also using API images
      "i.ibb.co" // ✅ For your second image in the URL
    ],
    formats: ["image/webp"],
  },
};

export default nextConfig;
