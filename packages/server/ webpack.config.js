module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.pem$/,
        use: 'raw-loader',
      },
    ],
  },
};
