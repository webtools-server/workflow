/**
 * pack config
 */

const path = require('path');
const defaultConfig = require('./config.default');

const cwd = process.cwd();

module.exports = (config = {}) => {
  const buildConfig = defaultConfig(config);
  const newBuildConfig = Object.assign(buildConfig, {
    defineConstants: Object.assign(buildConfig.defineConstants, {
      'process.env.NODE_ENV': 'production'
    })
  });

  newBuildConfig.assemble.renameFunc = (file) => {
    const arrPath = path.dirname(file.key).split(path.sep);
    const outputPath = path.join(cwd, 'public');

    file.dirname = path.join(outputPath, 'pages');
    file.filename = arrPath.pop();
    file.extname = '.html';
    return outputPath;
  };

  return newBuildConfig;
};
