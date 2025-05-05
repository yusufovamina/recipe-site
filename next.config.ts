import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["goldbelly.imgix.net"],
  

    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com", // Добавляем домен для API
      },
    ],
  },
};

export default nextConfig;