/** @type {import('next').NextConfig} */
require('dotenv').config();
const withVideos = require('next-videos');
module.exports = {
  reactStrictMode: true,
  env: {
    REACT_APP_FIREBASE_API_KEY: process.env.REACT_APP_FIREBASE_API_KEY,
    REACT_APP_FIREBASE_AUTH_DOMAIN: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    REACT_APP_PROJECT_ID: process.env.REACT_APP_PROJECT_ID,
    REACT_APP_FIREBASE_STORAGE_BUCKET:
      process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    REACT_APP_FIREBASE_SENDER_ID: process.env.REACT_APP_FIREBASE_SENDER_ID,
    REACT_APP_FIREBASE_APP_ID: process.env.REACT_APP_FIREBASE_APP_ID,
    REACT_APP_FIREBASE_MEASUREMENT_ID:
      process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: true,
  },
};

module.exports = withVideos();
