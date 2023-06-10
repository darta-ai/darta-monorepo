/** @type {import('next').NextConfig} */
require('dotenv').config();
const withVideos = require('next-videos');

module.exports = {
  env: {
    REACT_APP_FIREBASE_API_KEY:
      process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_API_KEY,
    REACT_APP_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_AUTH_DOMAIN,
    REACT_APP_PROJECT_ID: process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID,
    REACT_APP_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_STORAGE_BUCKET,
    REACT_APP_FIREBASE_SENDER_ID:
      process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_SENDER_ID,
    REACT_APP_FIREBASE_APP_ID:
      process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_APP_ID,
    REACT_APP_FIREBASE_MEASUREMENT_ID:
      process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_MEASUREMENT_ID,
    IS_APP_LIVE: process.env.NEXT_PUBLIC_IS_APP_LIVE,
    NODE_ENV: process.env.NEXT_PUBLIC_NODE_ENV,
    SUPERBASE_URL: process.env.NEXT_PUBLIC_SUPERBASE_URL,
    SUPERBASE_API_KEY: process.env.NEXT_PUBLIC_SUPERBASE_API_KEY,
    SMARTY_EMBEDDED_KEY: process.env.NEXT_PUBLIC_SMARTY_EMBEDDED_KEY,
    SMARTY_STREETS_AUTH_ID: process.env.NEXT_PUBLIC_SMARTY_STREETS_AUTH_ID,
    SMARTY_STREETS_AUTH_TOKEN:
      process.env.NEXT_PUBLIC_SMARTY_STREETS_AUTH_TOKEN,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  images: {
    loader: 'imgix',
    path: 'https://s3.amazonaws.com',
    domains: [
      'lh3.googleusercontent.com',
      's3.amazonaws.com',
      'http://s3.amazonaws',
    ],
    unoptimized: true,
    reactStrictMode: true,
  },
};

module.exports = withVideos();
