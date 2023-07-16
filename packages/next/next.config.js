const withTM = require('next-transpile-modules')(['../components']);

/** @type {import('next').NextConfig} */
const nextConfig = withTM({});

module.exports = nextConfig;
