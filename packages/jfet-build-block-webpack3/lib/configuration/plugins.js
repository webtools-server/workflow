/**
 * plugins
 */

/**
 * @see https://webpack.github.io/docs/configuration.html#plugins
 */
function addPlugins(plugins) {
    return (context, util) => util.merge({ plugins });
}

module.exports = addPlugins;
