/**
 * test
 */

const path = require('path');
const Server = require('karma').Server;
const getLibDefine = require('./get_define');

// rollup plugin
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');

// karma plugin
const karmaMocha = require('karma-mocha');
const karmaChromeLauncher = require('karma-chrome-launcher');
const karmaRollupPlugin = require('karma-rollup-plugin');
const karmaCoverage = require('karma-coverage');

const isCover = process.env.NODE_ENV === 'cover';
const cwd = process.cwd();

// 获取package libDefine字段
const libDefineFields = getLibDefine();

function getKarmaConfig(fields) {
  const karmaConfig = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: cwd,

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser eg. "js/*.js" or "test/**/*Spec.js"
    files: ['test/**/*.test.js'],

    // list of files to exclude
    exclude: ['node_modules'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.test.js': ['rollup']
    },

    rollupPreprocessor: {
      plugins: [
        resolve(),
        babel({
          include: path.join(__dirname, 'node_modules'),
          exclude: 'node_modules/**'
        }),
        commonjs()
      ],
      format: 'umd',
      moduleName: fields.moduleName,
      sourceMap: 'inline'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // plugins
    plugins: [
      karmaMocha,
      karmaChromeLauncher,
      karmaRollupPlugin
    ]
  };

  if (isCover) {
    karmaConfig.preprocessors['src/**/*.js'] = ['coverage'];
    karmaConfig.coverageReporter = {
      type: 'html',
      dir: 'coverage/'
    };
    karmaConfig.singleRun = true;
    karmaConfig.reporters.push('coverage');
    karmaConfig.plugins.push(karmaCoverage);
  }

  return karmaConfig;
}

if (libDefineFields) {
  new Server(getKarmaConfig(libDefineFields)).start();
}
