/**
 * test
 */

const EventEmitter = require('events');
const path = require('path');
const Server = require('karma').Server;

// rollup plugin
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');

// karma plugin
const karmaMocha = require('karma-mocha');
const karmaChromeLauncher = require('karma-chrome-launcher');
const karmaRollupPlugin = require('karma-rollup-plugin');
const karmaCoverage = require('karma-coverage');

const cwd = process.cwd();

const defaultOptions = {
  karma: {},
  coverage: {
    reporterType: 'html',
    reporterDir: 'coverage/'
  }
};

class TestOptions extends EventEmitter {
  constructor(argv, options) {
    super();
    this.karmaConfig = getKarmaConfig(this.argv, Object.assign({}, defaultOptions, options));
    this.karmaServer = new Server(this.karmaConfig);
  }
  start() {
    this.emit('before-test');
    this.karmaServer.start();
    this.emit('after-test');
  }
}

module.exports = TestOptions;

function getKarmaConfig(argv, options) {
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
          include: path.join(cwd, 'node_modules'),
          exclude: 'node_modules/**'
        }),
        commonjs()
      ],
      format: 'umd',
      moduleName: `rand_${String(Math.random()).replace(/\./g, '')}`,
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

  // 输出代码覆盖率
  if (argv.coverage) {
    karmaConfig.preprocessors['src/**/*.js'] = ['coverage'];
    karmaConfig.coverageReporter = {
      type: options.coverage.reporterType,
      dir: options.coverage.reporterDir
    };
    karmaConfig.singleRun = true;
    karmaConfig.reporters.push('coverage');
    karmaConfig.plugins.push(karmaCoverage);
  }

  Object.assign(karmaConfig, options.karma);
  return karmaConfig;
}
