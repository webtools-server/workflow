/**
 * alias
 */

/**
 * @see https://webpack.js.org/configuration/resolve/#resolve-alias
 */
function resolveAliases(aliases = {}) {
    return (context, util) => util.merge({
        resolve: {
            alias: aliases
        }
    });
}

module.exports = resolveAliases;
