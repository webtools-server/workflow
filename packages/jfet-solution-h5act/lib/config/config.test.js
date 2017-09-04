/**
 * test config
 */

const defaultConfig = require('./config.default');

module.exports = (config = {}) => {
  const buildConfig = defaultConfig(config);

  return Object.assign(buildConfig, {
    defineConstants: Object.assign(buildConfig.defineConstants, {
      'process.env.NODE_ENV': 'test'
    })
  });
};
