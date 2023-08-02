/** @type {import('next').NextConfig} */
const path = require('path')
// const withTM = require('next-transpile-modules')([path.resolve(__dirname, '../../packages/components')]);

// const nextConfig = withTM({});

module.exports = {
    // see docs: https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages
    transpilePackages: [path.resolve(__dirname, '../../packages/components')],
    output: 'standalone',
    experimental: {
        // this includes files from the monorepo base two directories up
        outputFileTracingRoot: path.join(__dirname, '../../'),
      },
};
