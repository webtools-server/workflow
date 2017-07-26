/**
 * content
 */

const path = require('path');

/**
 * @see https://webpack.js.org/configuration/entry-context/#context
 */
function setContext(contextPath) {
  return (context, util) => util.merge({
    context: path.resolve(contextPath || process.cwd())
  });
}

module.exports = setContext;
