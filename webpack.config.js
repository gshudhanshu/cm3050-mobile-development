// --web --https does not start web dev server with https #26706
// https://github.com/expo/expo/issues/26706

const createExpoWebpackConfigAsync = require('@expo/webpack-config')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('expo-crypto'),
  }
  config.module.rules.push({
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: { native: true, dimensions: false },
      },
    ],
  })
  return config
}
