/**
 * assemble webpack block.
 *
 * @see 
 */

const AssemblePlugin = require('./plugin/assemble');

/**
 * @param {object}   [options]
 * @return {Function}
 */
function assemble(options = {}) {
  return (context, util) => util.addPlugin(
    new AssemblePlugin(options)
  );
}

module.exports = assemble;
