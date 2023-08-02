/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['../../packages/components']);

const nextConfig = withTM({});
const path = require('path')

module.exports = {
    // ...nextConfig,
    output: 'standalone',
    experimental: {
        // this includes files from the monorepo base two directories up
        outputFileTracingRoot: path.join(__dirname, '../../'),
      },
};
