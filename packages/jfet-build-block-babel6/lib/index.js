/**
 * Babel webpack block.
 *
 * @see https://github.com/babel/babel-loader
 */

const babelLoader = require.resolve('babel-loader');

/**
 * @param {object} [options]
 * @param {bool}                    [options.cacheDirectory]  Use cache directory. Defaults to true.
 * @param {string[]}                [options.plugins]         Babel plugins to use.
 * @param {string[]}                [options.presets]         Babel presets to use.
 * @return {Function}
 */
function babel(options = {}) {
    options = Object.assign({
        cacheDirectory: true
    }, options);

    const setter = context => (prevConfig) => {
        context.babel = context.babel || {};

        // Merge babel config into the one stored in context
        context.babel = Object.assign({},
            context.babel,
            options,
            options.plugins ? { plugins: (context.babel.plugins || []).concat(options.plugins) } : {},
            options.presets ? { presets: (context.babel.presets || []).concat(options.presets) } : {}
        );
        return prevConfig;
    };

    return Object.assign(setter, { post: postConfig });
}

babel.loader = babelLoader;

function postConfig(context, util) {
    const ruleConfig = Object.assign({
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
            { loader: babelLoader, options: context.babel }
        ]
    }, context.match);

    return util.addLoader(ruleConfig);
}

module.exports = babel;
