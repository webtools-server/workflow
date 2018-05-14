/**
 * build
 */

const EventEmitter = require('events');
const path = require('path');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const commonjs = require('rollup-plugin-commonjs');
const eslint = require('rollup-plugin-eslint');
const dot = require('@jyb/rollup-plugin-dot');

const cwd = process.cwd();

// 默认输出配置
const defaultOutputOptions = {
  format: 'umd',
  name: 'LIB',
  file: path.join(cwd, 'dist/bundle.js'),
  sourcemap: false
};

// 默认rollup配置
const defaultRollupOptions = {
  input: '',
  plugins: []
};

class BuildOptions extends EventEmitter {
  /**
   * build
   * @param {Object} argv
   * @param {Object} options
   * @param {Object} options.rollup rollup配置
   * @param {Object} options.plugin 默认插件配置
   * @param {Object} options.output 输出配置
   * @param {Object} options.watch watch配置
   */
  constructor(argv, options) {
    super();
    this.argv = argv || {};
    // rollup配置
    this.rollupOptions = Object.assign({}, defaultRollupOptions, options.rollup);
    // 插件默认配置
    this.pluginOptions = options.plugin || {};
    // 输出配置
    this.outputOptions = Object.assign({}, defaultOutputOptions, { sourcemap: this.argv.sourcemap }, options.output);
    // watch配置
    this.watchOptions = options.watch || {};
    this.watchOptions.output = Object.assign({}, this.outputOptions, this.watchOptions.output);

    this.initPlugin();
    // 压缩代码
    if (this.argv.min) {
      this.addPlugin(uglify(Object.assign({}, this.pluginOptions.uglify)));
    }
  }
  async start() {
    if (this.argv.watch) {
      this.emit('before-watch');
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
        this.emit('after-watch');
      });
      return;
    }

    this.emit('before-build');
    const bundle = await rollup.rollup(this.rollupOptions);
    await bundle.write(this.outputOptions);
    this.emit('after-build');
  }
  initPlugin() {
    const options = this.pluginOptions;
    this.rollupOptions.plugins = this.rollupOptions.plugins.concat([
      resolve(
        Object.assign({}, options.resolve)
      ),
      commonjs(
        Object.assign({}, options.commonjs)
      ),
      eslint(
        Object.assign({
          include: path.join(cwd, 'src/**/**.js'),
          exclude: []
        }, options.eslint)
      ),
      dot(
        Object.assign({
          include: ['**/*.dot', '**/*.tpl'],
          exclude: ['**/index.html'],
          templateSettings: { selfcontained: true }
        }, options.dot)
      ),
      babel(
        Object.assign({
          exclude: path.join(cwd, 'node_modules/**')
        }, options.babel)
      )
    ]);
  }
  addPlugin(plugin) {
    this.rollupOptions.plugins.push(plugin);
  }
}

module.exports = BuildOptions;
