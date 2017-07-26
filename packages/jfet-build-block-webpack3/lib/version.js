/**
 * version
 */

/**
 * 版本解析
 * @param {String} versionString
 * @param {Object}
 */
function parse(versionString) {
  const [release, prerelease] = versionString.split('-');
  const splitRelease = release.split('.').map(number => parseInt(number, 10));

  return {
    major: splitRelease[0],
    minor: splitRelease[1],
    patch: splitRelease[2],
    prerelease: prerelease || '',
    raw: versionString
  };
}

module.exports = {
  parse
};
