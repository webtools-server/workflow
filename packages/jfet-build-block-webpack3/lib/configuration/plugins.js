/**
 * plugins
 */

/**
 * @see https://webpack.js.org/configuration/plugins/
 */
function addPlugins(plugins) {
    return (context, util) => util.merge({ plugins });
}

module.exports = addPlugins;
