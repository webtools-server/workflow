/**
 * devtool
 */

/**
 * @see https://webpack.github.io/docs/configuration.html#devtool
 */
function setDevTool(devtool = '') {
    return (context, util) => util.merge({ devtool });
}

module.exports = setDevTool;
