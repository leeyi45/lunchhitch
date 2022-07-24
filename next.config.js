require('dotenv').config();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

module.exports = {
  reactStrictMode: true,
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  env: {
    PORT: process.env.PORT || 3000,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  },
  ...withBundleAnalyzer({}),
};
