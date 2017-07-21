/**
 * html-webpack-plugin webpack block.
 *
 * @see https://github.com/jantimon/html-webpack-plugin
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function defaultSetConfig() {
    return {};
}

/**
 * @param {Object} [options]
 * @param {Object} [options.scan]
 * @param {String} [options.scan.pattern]
 * @param {Function} [options.scan.prefixFilter]
 * @param {Function} [options.setConfig]
 * @return {Function}
 */
function htmlPlugin(options = {}) {
    return (context, util) => {
        const scanResult = util.scan(options.scan);
        const plugins = [];
        const setConfig = options.setConfig || defaultSetConfig;

        for (const k in scanResult) {
            const pathDetail = path.parse(k);
            const curr = scanResult[k];
            const mergeConfig = setConfig(k, curr);

            plugins.push(
                new HtmlWebpackPlugin(Object.assign({
                    template: curr,
                    filename: k,
                    inject: 'body',
                    chunks: ['vendor', pathDetail.name]
                }, mergeConfig))
            );
        }
        return util.addPlugin(plugins);
    };
}

module.exports = htmlPlugin;
