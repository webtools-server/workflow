/**
 * 默认options
 */

const path = require('path');
const {
  PLUGIN_BABEL,
  PLUGIN_NODE_RESOLVE,
  PLUGIN_COMMONJS,
  PLUGIN_ESLINT,
  PLUGIN_DOT,
  PLUGIN_UGLIFY
} = require('./constant');

const getDir = p => path.join(process.cwd(), p);

// 默认rollup配置
exports.defaultRollupOptions = {
  input: '',
  plugins: []
};

// 默认开启的插件
exports.defaultUsePlugin = {
  [PLUGIN_NODE_RESOLVE]: true,
  [PLUGIN_COMMONJS]: true,
  [PLUGIN_ESLINT]: false,
  [PLUGIN_DOT]: false,
  [PLUGIN_BABEL]: true,
  [PLUGIN_UGLIFY]: false
};

// 默认插件配置
exports.defaultPluginOptions = {
  [PLUGIN_NODE_RESOLVE]: {},
  [PLUGIN_COMMONJS]: {},
  [PLUGIN_ESLINT]: {
    include: getDir('src/**/**.js'),
    exclude: []
  },
  [PLUGIN_DOT]: {
    include: ['**/*.dot', '**/*.tpl'],
    exclude: ['**/index.html'],
    templateSettings: { selfcontained: true }
  },
  [PLUGIN_BABEL]: {
    babelrc: false,
    exclude: getDir('node_modules/**'),
    presets: [
      [
        require.resolve('babel-preset-env'),
        {
          modules: false
        }
      ]
    ],
    plugins: [
      require.resolve('babel-plugin-external-helpers'),
      require.resolve('babel-plugin-transform-object-assign')
    ]
  },
  [PLUGIN_UGLIFY]: {}
};

// 默认输出配置
exports.defaultOutputOptions = {
  format: 'umd',
  name: 'LIB',
  file: getDir('dist/bundle.js'),
  sourcemap: false
};

// 默认watch配置
exports.defaultWatchOptions = {
  include: getDir('src/**'),
  exclude: getDir('node_modules/**')
};

