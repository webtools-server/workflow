/**
 * webpack plugin
 */

const chalk = require('chalk');
const assemble = require('assemble');
const watch = require('base-watch');
const path = require('path');

const hasOwn = Object.prototype.hasOwnProperty;
let resourceMap = {};

class AssemblePlugin {
    constructor(options = {}) {
        // default option
        const defaultOptions = {
            layouts: '',
            partials: '',
            pages: '',
            extname: '.html',
            outputPath: path.join(process.cwd(), 'public'),
            helper: {},
            injectData: {},
            mapPath: '',
            assembleApp() {},
            renameFunc: null
        };

        this.options = Object.assign({}, defaultOptions, options);
    }

    apply(compiler) {
        const options = this.options;

        if (!options.layouts || !options.partials || !options.pages) {
            return false;
        }

        const helper = options.helper;
        const app = assemble();

        if (typeof options.assembleApp === 'function') {
            options.assembleApp(app);
        }

        // plugin
        app.use(watch());

        // page
        app.layouts(options.layouts);
        app.partials(options.partials);
        app.pages(options.pages);

        // helper
        app.helper('require', requireHelper);
        for (const k in helper) {
            if (hasOwn.call(helper, k)) {
                app.helper(k, helper[k]);
            }
        }

        // task
        app.task('default', () => {
            app.src(options.pages)
                .pipe(app.renderFile(options.injectData))
                .pipe(app.dest((file) => {
                    console.log(chalk.green(`Assemble build successfully, ${JSON.stringify(file.key)}`));
                    if (typeof options.renameFunc !== 'function') {
                        file.extname = options.extname;
                        return options.outputPath;
                    }

                    return options.renameFunc(file);
                }));
        });

        // watch
        if (process.env.JFET_ENV === 'watch') {
            app.watch([options.layouts, options.partials, options.pages], ['default']);
        }

        // webpack compiler after emit
        compiler.plugin('after-emit', (compilation, callback) => {
            try {
                resourceMap = require(options.mapPath);
            } catch (e) {
                console.log(chalk.red('Assemble can not found resource map'));
            }

            app.build(['default'], (err) => {
                if (err) {
                    throw err;
                }
            });
            callback();
        });
    }
}

function requireHelper(resource) {
    if (hasOwn.call(resourceMap, resource)) {
        return resourceMap[resource];
    }

    return resource;
}

module.exports = AssemblePlugin;
