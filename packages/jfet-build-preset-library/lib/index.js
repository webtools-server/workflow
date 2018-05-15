/**
 * library preset
 */

const Build = require('./build');

const preset = {};

preset.run = (core, context) => {
  const { configuration, env } = context;
  const isProduction = env !== 'watch';
  const build = new Build(configuration);

  return new Promise((resolve) => {
    if (isProduction) {
      build.startBuild(resolve);
    } else {
      build.startWatch(resolve);
    }
  });
};

module.exports = preset;
