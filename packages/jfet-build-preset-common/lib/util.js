/**
 * 工具库
 */

const toStr = Object.prototype.toString;

function isObject(obj) {
  return toStr.call(obj) === '[object Object]';
}

module.exports = {
  isObject
};
