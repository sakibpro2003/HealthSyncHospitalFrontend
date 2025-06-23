import type { NextConfig } from "next";
import dotenv from "dotenv";

// Load your `.env` variables manually
dotenv.config();

const nextConfig: NextConfig = {
  images: {
    domains: [
      "medeasy.health",
      "api.medeasy.health",
      "i.ibb.co",
      "images.unsplash.com",
      "uhlbd.com",
    ],
    formats: ["image/webp"],
  },
  env: {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  },
};

export default nextConfig;
