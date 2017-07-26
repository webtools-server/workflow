/**
 * dot webpack block.
 *
 * @see http://olado.github.io/doT/index.html
 */

/**
 * @param {object} [options] See http://olado.github.io/doT/index.html templateSettings
 * @return {Function}
 */
function dot(options = {}) {
  return (context, util) => util.addLoader(
    Object.assign({
      test: /\.dot$/,
      use: [{
        loader: require.resolve('./loader/dot'),
        options
      }]
    }, context.match)
  );
}

module.exports = dot;
