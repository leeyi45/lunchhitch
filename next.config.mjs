import { config } from 'dotenv';

config();

const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  env: {
    PORT: process.env.PORT || 3000,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  },
};

export default nextConfig;
