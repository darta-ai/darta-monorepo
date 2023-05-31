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
    IS_APP_LIVE: process.env.IS_APP_LIVE,
    NODE_ENV: process.env.NODE_ENV,
    SUPERBASE_URL: process.env.SUPERBASE_URL,
    SUPERBASE_API_KEY: process.env.SUPERBASE_API_KEY,
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: true,
  },
};

module.exports = withVideos();

// REACT_APP_FIREBASE_API_KEY : "AIzaSyAjZz2ggOnHZJ-g0_8Nuz5bJFSVh756YB4",
// REACT_APP_FIREBASE_AUTH_DOMAIN:  "darta-desktop.firebaseapp.com",
// REACT_APP_PROJECT_ID : "darta-desktop",
// REACT_APP_FIREBASE_STORAGE_BUCKET : "darta-desktop.appspot.com",
// REACT_APP_FIREBASE_SENDER_ID : "682927959309",
// REACT_APP_FIREBASE_APP_ID : "1:682927959309:web:0b421dab61449b97041444",
// REACT_APP_FIREBASE_MEASUREMENT_ID : "G-NRB3DG38JH"
