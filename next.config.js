/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  port: process.env.PORT || 3000,
}

module.exports = nextConfig
