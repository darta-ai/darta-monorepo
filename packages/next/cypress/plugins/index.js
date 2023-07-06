// cypress/plugins/index.js

const injectNextDevServer = require('@cypress/react/plugins/next');

module.exports = (on, config) => {
  injectNextDevServer(on, config);
  return config;
};
