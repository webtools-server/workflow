/**
 * SASS webpack block.
 *
 * @see https://github.com/webpack-contrib/less-loader
 */

/**
 * @param {object}   [options] See http://lesscss.org/usage/#command-line-usage-options
 * @return {Function}
 */
function vue(options = {}) {
    return (context, util) => util.addLoader(
        Object.assign({
            test: /\.vue$/,
            use: [{
                loader: require.resolve('vue-loader'),
                options
            }]
        }, context.match)
    );
}

module.exports = vue;
