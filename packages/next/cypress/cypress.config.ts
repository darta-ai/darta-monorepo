import {defineConfig} from 'cypress';

export default defineConfig({
  projectId: 'i4ov2a',

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
