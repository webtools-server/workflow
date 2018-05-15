/**
 * build
 */

const rollup = require('rollup');
const {
  PLUGIN_BABEL,
  PLUGIN_NODE_RESOLVE,
  PLUGIN_COMMONJS,
  PLUGIN_ESLINT,
  PLUGIN_DOT,
  PLUGIN_UGLIFY
} = require('./constant');

const rollupPlugin = {
  [PLUGIN_NODE_RESOLVE]: require('rollup-plugin-node-resolve'),
  [PLUGIN_BABEL]: require('rollup-plugin-babel'),
  [PLUGIN_COMMONJS]: require('rollup-plugin-commonjs'),
  [PLUGIN_ESLINT]: require('rollup-plugin-eslint'),
  [PLUGIN_DOT]: require('@jyb/rollup-plugin-dot'),
  [PLUGIN_UGLIFY]: require('rollup-plugin-uglify')
};

const {
  defaultRollupOptions,
  defaultUsePlugin,
  defaultPluginOptions,
  defaultOutputOptions
} = require('./default-options');

class Build {
  /**
   * build
   * @param {Object} options
   * @param {Object} options.rollup rollup配置
   * @param {Object} options.plugin 默认插件配置
   * @param {Object} options.usePlugin 默认使用插件
   * @param {Object} options.output 输出配置
   * @param {Object} options.watch watch配置
   */
  constructor(options) {
    // rollup配置
    this.rollupOptions = Object.assign({}, defaultRollupOptions, options.rollup);
    // 默认使用插件
    this.usePlugin = Object.assign({}, defaultUsePlugin, options.usePlugin);
    // 插件默认配置
    this.pluginOptions = options.plugin || {};
    // 输出配置
    this.outputOptions = Object.assign({}, defaultOutputOptions, options.output);
    // watch配置
    this.watchOptions = options.watch || {};
    this.watchOptions.output = Object.assign({}, this.outputOptions, this.watchOptions.output);

    this.initPlugin();
  }
  startWatch(done) {
    const watcher = rollup.watch(this.watchOptions);
    watcher.on('event', (event) => {
      // event.code can be one of:
      //   START        — the watcher is (re)starting
      //   BUNDLE_START — building an individual bundle
      //   BUNDLE_END   — finished building a bundle
      //   END          — finished building all bundles
      //   ERROR        — encountered an error while bundling
      //   FATAL        — encountered an unrecoverable error
      console.log(event);
      done();
    });
  }
  startBuild(done) {
    rollup.rollup(this.rollupOptions).then((bundle) => {
      bundle.write(this.outputOptions);
      done();
    });
  }
  initPlugin() {
    const options = this.pluginOptions;

    for (const k in defaultPluginOptions) {
      if (this.usePlugin[k] && rollupPlugin[k]) {
        this.addPlugin(rollupPlugin[k](
          Object.assign({}, defaultPluginOptions[k], options[k])
        ));
      }
    }
  }
  addPlugin(plugin) {
    this.rollupOptions.plugins.push(plugin);
  }
}

module.exports = Build;
