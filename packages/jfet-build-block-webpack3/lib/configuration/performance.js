/**
 * performance
 */

/**
 * @param {object} performanceBudget
 * @param {number} performanceBudget.maxAssetSize
 * @param {number} performanceBudget.maxEntrypointSize
 * @param {string} performanceBudget.hints              'warning' or 'error'
 */
function performance(performanceBudget) {
  return (context, util) => util.merge({
    performance: performanceBudget
  });
}

module.exports = performance;
