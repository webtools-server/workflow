/**
 * webpack plugin
 */

const chalk = require('chalk');
const assemble = require('assemble');
const watch = require('base-watch');
const path = require('path');
const glob = require('glob');
const assembleHelper = require('./helper');

const hasOwn = Object.prototype.hasOwnProperty;

class AssemblePlugin {
  constructor(options = {}) {
    // default option
    const defaultOptions = {
      layouts: '',
      partials: '',
      pages: '',
      helper: {},
      injectData: {},
      mapPath: '',
      publicPath: 'public',
      assembleApp() {},
      renameFunc: null
    };

    this.resourceMap = {};
    this.options = Object.assign({}, defaultOptions, options);
  }

  apply(compiler) {
    const options = this.options;

    if (!options.layouts || !options.partials || !options.pages) {
      return false;
    }

    const helper = options.helper;
    const app = assemble();

    // plugin
    app.use(watch());

    // page
    app.layouts(reduceObjs(options.layouts));
    app.partials(reduceObjs(options.partials));
    app.pages(options.pages);

    // helper
    app.helper('require', assembleHelper.requireHelper.bind(this));
    app.helper('manifest', assembleHelper.manifestHelper.bind(this));
    app.helper('inline', assembleHelper.inlineHelper.bind(this));
    app.helper('moment', assembleHelper.momentHelper.bind(this));
    for (const k in helper) {
      if (hasOwn.call(helper, k)) {
        app.helper(k, helper[k]);
      }
    }

    // task
    app.task('default', (cb) => {
      try {
        this.resourceMap = require(options.mapPath);
      } catch (e) {
        console.log(chalk.red('Assemble can not found resource map'));
      }

      app.src(options.pages)
        .pipe(app.renderFile(options.injectData))
        .pipe(app.dest((file) => {
          if (typeof options.renameFunc !== 'function') {
            file.extname = '.html';
            return path.join(process.cwd(), 'public');
          }

          return options.renameFunc(file);
        }))
        .on('finish', () => {
          cb();
          console.log(chalk.green('Assemble build successfully.'));
        });
    });

    // watch
    if (process.env.JFET_ENV === 'watch') {
      app.watch([options.layouts, options.partials, options.pages], ['default']);
    }

    if (typeof options.assembleApp === 'function') {
      options.assembleApp(app);
    }

    // webpack compiler after emit
    compiler.plugin('after-emit', (compilation, callback) => {
      app.build(['default'], (err) => {
        if (err) {
          throw err;
        }
        callback();
      });
    });
  }
}

function reduceObjs(objs) {
  return glob.sync(objs).reduce((obj, val) => {
    obj[path.basename(val)] = {
      path: val
    };
    return obj;
  }, {});
}

module.exports = AssemblePlugin;
