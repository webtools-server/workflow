/**
 * html-webpack-plugin webpack block.
 *
 * @see https://github.com/jantimon/html-webpack-plugin
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

        for (const k in scanResult) {
            const pathDetail = path.parse(k);

            plugins.push(
                new HtmlWebpackPlugin({
                    template: scanResult[k],
                    filename: k,
                    inject: 'body',
                    chunks: ['vendor', pathDetail.name]
                })
            );
        }
        return util.addPlugin(plugins);
    };
}

module.exports = htmlPlugin;
