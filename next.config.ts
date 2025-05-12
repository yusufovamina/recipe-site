import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts');

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

export default withNextIntl(nextConfig);