/**
 * SASS webpack block.
 *
 * @see https://github.com/webpack-contrib/less-loader
 */

/**
 * @param {object}   [options] See http://lesscss.org/usage/#command-line-usage-options
 * @return {Function}
 */
function less(options = {}) {
    return (context, util) => util.addLoader(
        Object.assign({
            test: /\.less$/,
            use: [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: {
                        sourceMap: Boolean(options.sourceMap)
                    }
                },
                // {
                //     loader: require.resolve('postcss-loader')
                // },
                {
                    loader: require.resolve('less-loader'),
                    options
                }
            ]
        }, context.match)
    );
}

module.exports = less;
