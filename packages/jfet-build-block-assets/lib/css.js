
/**
 * @param {object} [options]    You can pass all css-loader options.
 * @return {Function}
 * @see https://github.com/webpack-contrib/css-loader
 */
function css(options = {}) {
    return (context, util) => util.addLoader(
        Object.assign({
            test: /\.css$/,
            use: [
                { loader: require.resolve('style-loader') },
                { loader: require.resolve('css-loader'), options }
            ]
        },
        context.match
        )
    );
}

module.exports = css;
