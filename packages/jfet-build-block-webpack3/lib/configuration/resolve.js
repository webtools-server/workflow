/**
 * resolve
 */

/**
 * @see https://webpack.js.org/configuration/resolve/
 */
function resolve(config) {
    return (context, util) => util.merge({
        resolve: config
    });
}

module.exports = resolve;
