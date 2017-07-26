/**
 * output
 */

const path = require('path');

/**
 * @see https://webpack.github.io/docs/configuration.html#output
 */
function setOutput(output) {
  if (typeof output === 'string') {
    output = {
      filename: path.basename(output) || 'bundle.js',
      path: path.resolve(path.dirname(output) || './build')
    };
  }

  return (context, util) => util.merge({ output });
}

module.exports = setOutput;
