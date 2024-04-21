module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      'react-native-paper/babel',
      [
        'module-resolver',
        {
          alias: {
            '@/darta-types': './packages/darta-types/src',
            '@/darta-styles': './packages/darta-styles/src',
          },
          extensions: [".tsx", ".ts", ".js", ".json"], 
        }
      ]
    ]
  };
};
