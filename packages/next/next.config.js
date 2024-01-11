/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  // see docs: https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages
  transpilePackages: [path.resolve(__dirname, '../../packages/darta-types')],
  output: 'standalone',
  // experimental: {
  //   // this includes files from the monorepo base two directories up
  //   outputFileTracingRoot: path.join(__dirname, '../../'),
  // },
  serverRuntimeConfig: {
    host: '0.0.0.0',
    port: 1169,
  },
  async redirects() {
    return [
      {
        source: '/exhibition',
        has: [
          {
            type: 'query',
            key: 'exhibitionId',
          },
        ],
        destination: '/',
        permanent: true,
      },
      {
        source: '/location',
        has: [
          {
            type: 'query',
            key: 'locationId',
          },
        ],
        destination: '/',
        permanent: true,
      },{
        source: '/lists',
        has: [
          {
            type: 'query',
            key: 'listId',
          },
        ],
        destination: '/',
        permanent: true,
      },
    ]
  },  
};
