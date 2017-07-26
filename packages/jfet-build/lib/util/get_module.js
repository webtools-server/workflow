/**
 * 获取模块
 */

const path = require('path');
const utilLog = require('./log');

function getModule(resources) {
  const err = [];
  let result = null;

  for (let i = 0, l = resources.length; i < l; i++) {
    try {
      const curr = resources[i];
      const modulePaths = [path.join(__dirname, '..', '..', 'node_modules', curr), curr];

      // 按照当前插件node_modules，全局下安装的node_modules顺序找到模块
      for (let m = 0, n = modulePaths.length; m < n; m++) {
        result = require(modulePaths[i]);
        return result;
      }
    } catch (e) {
      err.push(e);
    }
  }

  if (!result) {
    utilLog.error(err.join('\n'));
  }

  return result;
}

module.exports = getModule;
