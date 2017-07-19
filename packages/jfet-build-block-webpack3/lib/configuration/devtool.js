/**
 * devtool
 */

/**
 * @see https://webpack.js.org/configuration/devtool/#devtool
 */
function setDevTool(devtool = '') {
    return (context, util) => util.merge({ devtool });
}

module.exports = setDevTool;
