/**
 * Webpack base config block.
 *
 * @see https://webpack.github.io/docs/configuration.html
 */

const webpack = require('webpack');
const chalk = require('chalk');
const version = require('./version');
const _ = require('./util');

const webpackVersion = version.parse(require('webpack/package.json').version);

// configuration
exports.defineConstants = require('./configuration/define');
exports.addPlugins = require('./configuration/plugins');
exports.entryPoint = require('./configuration/entry');
exports.performance = require('./configuration/performance');
exports.resolve = require('./configuration/resolve');
exports.resolveAliases = require('./configuration/alias');
exports.setContext = require('./configuration/content');
exports.setDevTool = require('./configuration/devtool');
exports.setOutput = require('./configuration/output');

// plugin
exports.extractText = require('./plugin/extract_text');
exports.htmlPlugin = require('./plugin/html');

exports.webpackCore = webpack;
exports.createConfig = createConfig;
exports.customConfig = customConfig;
exports.commonDoneHandler = commonDoneHandler;

/**
 * 创建配置
 * @param {Function[]} configSetters
 * @return {object}
 */
function createConfig(core, configSetters) {
    if (!_.isArrayOfFunc(configSetters)) {
        throw new Error('configSetters must be an array of functions.');
    }

    return core.createConfig({
        webpack,
        webpackVersion
    }, [createEmptyConfig].concat(configSetters));
}

function createEmptyConfig(context, util) {
    return util.merge({
        module: {
            rules: []
        },
        plugins: []
    });
}

function customConfig(wpConfig) {
    return (context, util) => util.merge(wpConfig);
}


function commonDoneHandler(isWatch, resolve, err, stats) {
    if (err) {
        console.log(chalk.red(err));
        process.exit(1);
    }

    const { errors, time } = stats.toJson();
    if (errors && errors.length) {
        console.log(chalk.red(errors));
        process.exit(1);
    }

    if (!isWatch || stats.hasErrors()) {
        const buildInfo = stats.toString({
            colors: true,
            children: true
        });
        console.log(stats.hasErrors() ? chalk.red(buildInfo) : buildInfo);
    } else {
        console.log(
            stats.stats ?
                chalk.green('Compiled successfully.') :
                chalk.green(`Compiled successfully in ${time}ms.`)
        );
    }
    resolve();
}
