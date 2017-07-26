/**
 * manifest webpack block.
 *
 * @see 
 */

const ManifestPlugin = require('./plugin/manifest');

/**
 * @param {object}   [options]
 * @return {Function}
 */
function manifest(options = {}) {
  return (context, util) => util.addPlugin(
    new ManifestPlugin(options)
  );
}

module.exports = manifest;
