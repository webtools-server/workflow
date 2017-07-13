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
function sass(options = {}) {
    return (context, util) => util.addLoader(
        Object.assign({
            test: /\.(sass|scss)$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: Boolean(options.sourceMap)
                    }
                },
                {
                    loader: 'postcss-loader'
                },
                {
                    loader: 'sass-loader',
                    options
                }
            ]
        }, context.match)
    );
}

module.exports = sass;
