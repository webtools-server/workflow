/**
 * build
 */

const rollup = require('rollup');
const chalk = require('chalk');
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
  defaultOutputOptions,
  defaultWatchOptions
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
    this.watchOptions = Object.assign({}, defaultWatchOptions, options.watch);

    this.initPlugin();
  }
  startWatch(done) {
    const watcher = rollup.watch({
      ...this.rollupOptions,
      output: this.outputOptions,
      watch: this.watchOptions
    });
    watcher.on('event', (event) => {
      // event.code can be one of:
      //   START        — the watcher is (re)starting
      //   BUNDLE_START — building an individual bundle
      //   BUNDLE_END   — finished building a bundle
      //   END          — finished building all bundles
      //   ERROR        — encountered an error while bundling
      //   FATAL        — encountered an unrecoverable error
      if (event.code === 'START') {
        console.log(chalk.green('Compiled start...'));
      } else if (event.code === 'ERROR' || event.code === 'FATAL') {
        console.log(chalk.red(JSON.stringify(event, null, 2)));
      } else if (event.code === 'BUNDLE_END') {
        console.log(chalk.green(JSON.stringify({
          input: event.input,
          output: event.output,
          duration: event.duration
        }, null, 2)));
      } else if (event.code === 'END') {
        console.log(chalk.green('Compiled successfully.'));
      }
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
    const plugins = [];

    for (const k in defaultPluginOptions) {
      if (this.usePlugin[k] && rollupPlugin[k]) {
        plugins.push(rollupPlugin[k](
          Object.assign({}, defaultPluginOptions[k], options[k])
        ));
      }
    }
    this.rollupOptions.plugins = plugins.concat(this.rollupOptions.plugins);
  }
  addPlugin(plugin) {
    this.rollupOptions.plugins.push(plugin);
  }
}

module.exports = Build;
