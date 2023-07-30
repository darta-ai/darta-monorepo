const withTM = require('next-transpile-modules')(['../components']);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({});
const path = require('path')

module.exports = {
    ...nextConfig,
    output: 'standalone',
    experimental: {
        // this includes files from the monorepo base two directories up
        outputFileTracingRoot: path.join(__dirname, '../../'),
      },
};
