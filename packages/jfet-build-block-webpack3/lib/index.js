/**
 * Webpack base config block.
 *
 * @see https://webpack.github.io/docs/configuration.html
 */

const webpack = require('webpack');
const version = require('./version');
const _ = require('./util');

const webpackVersion = version.parse(require('webpack/package.json').version);

exports.defineConstants = require('./configuration/define');
exports.addPlugins = require('./configuration/plugins');
exports.entryPoint = require('./configuration/entry');
exports.performance = require('./configuration/performance');
exports.resolve = require('./configuration/resolve');
exports.resolveAliases = require('./configuration/alias');
exports.setContext = require('./configuration/content');
exports.setDevTool = require('./configuration/devtool');
exports.setOutput = require('./configuration/output');

exports.createConfig = createConfig;
exports.customConfig = customConfig;

/**
 * 创建配置
 * @param {Function[]} configSetters
 * @return {object}
 */
function createConfig(core, configSetters) {
    if (_.isArrayOfFunc(configSetters)) {
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
