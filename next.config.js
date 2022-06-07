/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.PORT || 3000,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  },
};

module.exports = nextConfig;
