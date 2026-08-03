const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// @insforge/sdk has a Node-only crypto code path (guarded by
// `process.versions?.node`, never true in React Native) that Metro still
// tries to statically resolve — stub it out since it's unreachable at runtime.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  crypto: require.resolve('./stubs/empty-crypto.js'),
};

module.exports = withNativeWind(config, { input: './global.css' });
