/** @type {import('next').NextConfig} */

module.exports = {
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
