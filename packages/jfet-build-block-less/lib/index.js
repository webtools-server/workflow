/**
 * less webpack block.
 *
 * @see https://github.com/webpack-contrib/less-loader
 */

/**
 * @param {object}   [options] See http://lesscss.org/usage/#command-line-usage-options
 * @return {Function}
 */
function less(isPostcss = false, options = {}) {
    const lessLoader = {
        test: /\.less$/,
        use: [
            require.resolve('style-loader'),
            {
                loader: require.resolve('css-loader'),
                options: {
                    sourceMap: Boolean(options.sourceMap),
                    minimize: Boolean(options.minimize)
                }
            },
            {
                loader: require.resolve('less-loader'),
                options
            }
        ]
    };

    if (isPostcss) {
        lessLoader.use.splice(2, 0, { loader: require.resolve('postcss-loader') });
    }

    return (context, util) => util.addLoader(
        Object.assign(lessLoader, context.match)
    );
}

module.exports = less;
