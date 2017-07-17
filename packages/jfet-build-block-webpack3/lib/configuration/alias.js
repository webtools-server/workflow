/**
 * alias
 */

/**
 * @see https://webpack.github.io/docs/configuration.html#resolve-alias
 */
function resolveAliases(aliases = {}) {
    return (context, util) => util.merge({
        resolve: {
            alias: aliases
        }
    });
}

module.exports = resolveAliases;
