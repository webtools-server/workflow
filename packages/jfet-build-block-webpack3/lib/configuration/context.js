/**
 * content
 */

const path = require('path');

/**
 * @see https://webpack.github.io/docs/configuration.html#context
 */
function setContext(contextPath) {
    return (context, util) => util.merge({
        context: path.resolve(contextPath || process.cwd())
    });
}

module.exports = setContext;
