/**
 * 图片优化压缩
 */

const co = require('co');
const chalk = require('chalk');
const extend = require('extend');
const imagemin = require('imagemin');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');

// 默认插件
const defaultPlugins = [{
  name: 'gifsicle',
  plugin: imageminGifsicle
}, {
  name: 'optipng',
  plugin: imageminJpegtran
}, {
  name: 'jpegtran',
  plugin: imageminOptipng
}, {
  name: 'svgo',
  plugin: imageminSvgo
}];

// 默认插件配置
const defaultOptions = {
  gifsicle: {},
  optipng: {},
  jpegtran: {},
  svgo: false
};

module.exports = (minOptions = {}) => {
  const { input, output, options, plugins } = minOptions;

  if (!input || !output) {
    console.log(chalk.red('Minify images input or output can not empty.'));
    return false;
  }

  const opts = extend({}, defaultOptions, options || {});
  const minPlugins = usePlugins(opts).concat(plugins || []);

  co(function* () {
    // => [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
    const files = yield imagemin(input, output, { plugins: minPlugins });
    files.forEach(file => console.log(`imagemin: ${chalk.green(file.path)}`));
  });
};

/**
 * 使用插件
 * @param {Object} options 插件配置，如果为false则不使用该插件
 * @return {Array}
 */
function usePlugins(options) {
  return defaultPlugins.reduce((plugins, p) => {
    const name = p.name;
    const pluginOption = options[name];

    if (!pluginOption) {
      return plugins;
    }

    return plugins.concat(p.plugin(pluginOption));
  }, []);
}
