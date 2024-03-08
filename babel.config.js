module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      'babel-preset-expo',
      // ['@babel/preset-env', { loose: true }],
      //   ['@babel/preset-env', { targets: { node: 'current' }, loose: true }],
      //   '@babel/preset-react',
      //   'module:metro-react-native-babel-preset',
    ],
    // plugins: ['@babel/plugin-transform-runtime'],
  }
}
