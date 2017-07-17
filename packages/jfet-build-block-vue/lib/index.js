/**
 * vue webpack block.
 *
 * @see https://vue-loader.vuejs.org/zh-cn/
 */

/**
 * @param {object}   [options]
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
