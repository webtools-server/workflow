/**
 * SASS webpack block.
 *
 * @see https://github.com/webpack-contrib/sass-loader
 */

/**
 * @param {object}   [options] See https://github.com/sass/node-sass#options
 * @param {string[]} [options.includePaths]
 * @param {bool}     [options.indentedSyntax]
 * @param {string}   [options.outputStyle]
 * @param {bool}     [options.sourceMap]
 * @return {Function}
 */
function sass(isPostcss = false, options = {}) {
    const sassLoader = {
        test: /\.(sass|scss)$/,
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
                loader: require.resolve('sass-loader'),
                options
            }
        ]
    };

    if (isPostcss) {
        sassLoader.use.splice(2, 0, { loader: require.resolve('postcss-loader') });
    }

    return (context, util) => util.addLoader(
        Object.assign(sassLoader, context.match)
    );
}

module.exports = sass;
