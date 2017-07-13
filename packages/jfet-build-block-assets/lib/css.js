const { synthesizeMatch } = require('./compat');

/**
 * @param {string} [fileType]   Deprecated.
 * @param {object} [options]    You can pass all css-loader options.
 * @return {Function}
 * @see https://github.com/webpack-contrib/css-loader
 */
function css(fileType, options = {}) {
    if (fileType && typeof fileType === 'object' && Object.keys(options).length === 0) {
        options = fileType;
        fileType = null;
    }
    if (fileType || options.exclude || options.include) {
        console.warn('css(): You are using the deprecated \'fileType\' parameter, \'options.exclude\' or \'options.include\'. Use match() instead.');
    }

    return (context, util) => util.addLoader(
        Object.assign({
            test: /\.css$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader', options }
            ]
        },
            // for API backwards compatibility only
        synthesizeMatch(context.fileType(fileType || 'text/css'), options),
        context.match
        )
    );
}

module.exports = css;
