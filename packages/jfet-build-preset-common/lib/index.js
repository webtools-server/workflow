/**
 * main
 */

const path = require('path');
const autoprefixer = require('autoprefixer');

const webpack = require('@jyb/jfet-build-block-webpack3');
const sass = require('@jyb/jfet-build-block-sass');
const less = require('@jyb/jfet-build-block-less');
const babel = require('@jyb/jfet-build-block-babel6');
const assets = require('@jyb/jfet-build-block-assets');
const dot = require('@jyb/jfet-build-block-dot');
const vue = require('@jyb/jfet-build-block-vue');
const assemble = require('@jyb/jfet-build-block-assemble');
const manifest = require('@jyb/jfet-build-block-manifest');
const util = require('./util');

const {
  // config
  createConfig,
  entryPoint,
  defineConstants,
  resolveAliases,
  setContext,
  setDevTool,
  scanEntry,
  setOutput,
  addPlugins,

  // plugin
  extractText,

  // webpack
  webpackCore,
  commonDoneHandler
} = webpack;
const preset = {};
const { LoaderOptionsPlugin } = webpackCore;
const { UglifyJsPlugin, CommonsChunkPlugin } = webpackCore.optimize;

preset.run = (core, context) => {
  const { configuration, env } = context;
  const isProduction = env !== 'watch';
  const jsFileName = isProduction ? 'js/[name]-[chunkhash:8].js' : 'js/[name].js';
  const scssStyleFileName = isProduction ? 'css/[name]-[chunkhash:8].css' : 'css/[name].css';
  const lessStyleFileName = isProduction ? 'css/[name].less-[chunkhash:8].css' : 'css/[name].less.css';
  const vueStyleFileName = isProduction ? 'css/[name].vue-[chunkhash:8].css' : 'css/[name].vue.css';
  const commonsChunkPluginConfig = configuration.commonsChunkPlugin;

  // plugin
  let plugins = [
    new LoaderOptionsPlugin({
      options: {
        context: __dirname,
        minimize: true,
        postcss: [
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9'
            ],
          })
        ],
      },
    })
  ];

  // 压缩混淆代码
  if (isProduction) {
    plugins.push(new UglifyJsPlugin(Object.assign({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      screwIe8: true,
      sourceMap: false
    }, configuration.uglifyJsPlugin)));
  }

  // 公共插件
  if (commonsChunkPluginConfig) {
    let commonsChunkPluginCfgs = [];

    if (Array.isArray(commonsChunkPluginConfig)) {
      commonsChunkPluginCfgs = commonsChunkPluginConfig.map((cfg, i) => {
        cfg = Object.assign({
          name: `vendor${i}`,
          filename: jsFileName
        }, cfg);
        return new CommonsChunkPlugin(cfg);
      });
    } else if (util.isObject(commonsChunkPluginConfig)) {
      commonsChunkPluginCfgs = new CommonsChunkPlugin(Object.assign({
        name: 'vendor',
        filename: jsFileName
      }, commonsChunkPluginConfig));
    }

    plugins = plugins.concat(commonsChunkPluginCfgs);
  }

  // setter
  const configSetters = [
    scanEntry(Object.assign({ prefixFilter }, configuration.scanEntry)),
    entryPoint(configuration.entryPoint),
    setOutput(Object.assign({
      filename: jsFileName,
      chunkFilename: jsFileName
    }, configuration.setOutput)),
    defineConstants(configuration.defineConstants),
    resolveAliases(configuration.resolveAliases),
    setContext(configuration.setContext),
    setDevTool(configuration.setDevTool),
    babel(Object.assign({
      babelrc: false,
      presets: [
        [require.resolve('babel-preset-es2015'), { modules: false }],
        require.resolve('babel-preset-stage-0'),
      ],
      cacheDirectory: true
    }, configuration.babel)),
    dot(configuration.dot),
    core.match(/\.vue$/, [
      sass(true, Object.assign({
        minimize: isProduction
      }, configuration.sass)),
      vue(Object.assign({
        loaders: {
          js: babel.loader
        }
      }, configuration.vue)),
      extractText(configuration.extractTextVue || vueStyleFileName, 'vue', {
        name: 'scss',
        test: /\.scss$/,
        extract: {
          fallback: require.resolve('vue-style-loader')
        }
      })
    ]),
    assemble(configuration.assemble),
    core.match(/\.less$/, [
      less(true, Object.assign({
        minimize: isProduction
      }, configuration.less)),
      extractText(configuration.extractTextLess || lessStyleFileName)
    ]),
    core.match(/\.scss$/, [
      sass(true, Object.assign({
        minimize: isProduction
      }, configuration.sass)),
      extractText(configuration.extractTextScss || scssStyleFileName)
    ]),
    core.match(/\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i, [
      assets.url(Object.assign({
        name: 'image/[name]-[hash:8].[ext]',
        limit: 10000
      }, configuration.image))
    ]),
    core.match(/\.svg(\?.*)?$/, [
      assets.url(Object.assign({
        name: 'image/[name]-[hash:8].[ext]',
        minetype: 'image/svg+xml'
      }, configuration.svg))
    ]),
    core.match(/\.(woff|woff2|ttf|eot)(\?.*)?$/, [
      assets.file(Object.assign({
        name: 'font/[name]-[hash:8].[ext]'
      }, configuration.font))
    ]),
    manifest(configuration.manifestPlugin),
    addPlugins(plugins)
  ];

  return new Promise((resolve) => {
    const compiler = webpackCore(createConfig(context, configSetters));
    const done = commonDoneHandler.bind(null, !isProduction, resolve);

    if (!isProduction) {
      compiler.watch(200, done);
    } else {
      compiler.run(done);
    }
  });
};

function prefixFilter(name) {
  const pathObj = path.parse(name);
  const newName = path.basename(pathObj.dir);
  const ext = pathObj.ext;

  if (ext === '.html') {
    return newName ? newName + ext : name;
  }

  return newName || name;
}

module.exports = preset;
