/**
 * default config
 */

const path = require('path');

const cwd = process.cwd();

module.exports = (config = {}) => {
  const buildEnv = process.env.BUILD_ENV;
  const defineConstants = (config.defineConstants || {})[buildEnv] || {};
  const publicPath = config.publicPath[buildEnv] || '/public/';
  const entry = config.entry;
  const commonsChunkConfig = config.commonsChunk || {};
  const commonsChunkPlugin = [];
  const entryPoint = Object.assign({}, entry);

  // common chunks
  for (const k in commonsChunkConfig) {
    const currentCommon = commonsChunkConfig[k];
    entryPoint[k] = currentCommon.libs;
    commonsChunkPlugin.push(Object.assign({ name: k }, currentCommon.options));
  }

  // resolve.alias
  const resolveAlias = Object.keys(config.resolveAlias || {}).reduce((alias, k) => {
    alias[k] = path.resolve(cwd, config.resolveAlias[k]);
    return alias;
  }, {});

  return {
    scanEntry: entry ? {} : { pattern: path.join(cwd, 'pages/**/index.js') },
    entryPoint,
    noChunkHash: config.noChunkHash,
    setOutput: {
      path: path.join(cwd, 'public'),
      publicPath,
      chunkFilename: 'js/[name]-[chunkhash:8].js'
    },
    resolveAliases: Object.assign({
      assets: path.join(cwd, 'assets'),
      components: path.join(cwd, 'components'),
      services: path.join(cwd, 'services')
    }, resolveAlias),
    defineConstants: Object.keys(defineConstants).reduce((obj, item) => {
      obj[item] = defineConstants[item];
      obj[`process.env.${item}`] = defineConstants[item];
      return obj;
    }, {}),
    sass: {
      includePaths: ['node_modules']
    },
    image: {
      limit: (typeof config.imageLimit !== 'number') ? 10000 : config.imageLimit
    },
    assemble: {
      layouts: path.join(cwd, 'pages/layouts/*.hbs'),
      partials: path.join(cwd, 'pages/partials/*.hbs'),
      pages: path.join(cwd, 'pages/**/index.hbs'),
      mapPath: path.join(cwd, 'public/manifest.json'),
      renameFunc(file) {
        const arrPath = path.dirname(file.key).split(path.sep);
        const outputPath = path.join(cwd, 'public');

        file.dirname = path.join(outputPath, 'pages');
        file.filename = arrPath.pop();
        file.extname = '.html';
        return outputPath;
      }
    },
    commonsChunkPlugin
  };
};
