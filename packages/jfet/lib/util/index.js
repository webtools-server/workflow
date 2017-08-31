/**
 * util
 */

const utilLog = require('./log');

/**
 * 加载npm包
 * @param {Array} resources
 * @return {Object|Null}
 */
function loadPackage(resources = []) {
  if (!Array.isArray(resources)) {
    resources = [resources];
  }

  const err = [];
  let result = null;

  for (let i = 0, l = resources.length; i < l; i++) {
    try {
      /* eslint-disable import/no-dynamic-require */
      result = require(resources[i]);
      return result;
    } catch (e) {
      err.push(e);
    }
  }
  utilLog.error(err.join('\n'));
  return result;
}

module.exports = {
  loadPackage
};
