/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');

// List all the packages in your monorepo
const workspaces = [
  path.resolve(__dirname, 'packages/mobile'),
  path.resolve(__dirname, 'packages/graphserver'),
  path.resolve(__dirname, 'packages/next'),
  path.resolve(__dirname, 'packages/darta-types'),
  // Add other packages if you have more
];

module.exports = {
  watchFolders: [
    ...workspaces,
    // Include the .pnpm folder for node_modules's resolution
    path.resolve(__dirname, './node_modules'),
  ],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: {
      // Utilize node-libs-react-native if necessary and any other extraneous modules
      ...require('node-libs-react-native'),
    },
  },
};
