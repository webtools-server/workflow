/**
 * 工具库
 */

const glob = require('glob');
const omitBy = require('lodash.omitby');
const webpackMerge = require('webpack-merge');

function defaultPrefixFilter(name) { return name; }

/**
 * 配置合并
 * @param {Object} configSnippet 配置片段
 * @return {Function}
 */
function merge(configSnippet) {
  return prevConfig => webpackMerge.smart(prevConfig, configSnippet);
}

/**
 * 添加loader
 * @param {Object} loaderDef loader配置
 * @return {Function}
 */
function addLoader(loaderDef) {
  const cleanedLoaderDef = omitBy(loaderDef, v => typeof v === 'undefined');
  return prevConfig => webpackMerge.smart(prevConfig, {
    module: {
      rules: [cleanedLoaderDef]
    }
  });
}

/**
 * 添加插件
 * @param {Array|Object} plugin
 * @return {Function}
 */
function addPlugin(plugin) {
  return prevConfig => Object.assign({},
    prevConfig, { plugins: prevConfig.plugins.concat(Array.isArray(plugin) ? plugin : [plugin]) }
  );
}

/**
 * 查找入口
 * @param {Object} options
 * @param {String} options.pattern glob like `*.css` or `{*.js, *.jsx}`
 * @param {Function} options.prefixFilter 过滤函数
 * @return {Object}
 */
function scan(options = {}) {
  if (!options.pattern) {
    return {};
  }

  const result = glob.sync(options.pattern);
  const prefixFilter = options.prefixFilter || defaultPrefixFilter;

  return result.reduce((entries, item) => {
    entries[prefixFilter(item)] = item;
    return entries;
  }, {});
}

module.exports = {
  merge,
  addLoader,
  addPlugin,
  scan
};
