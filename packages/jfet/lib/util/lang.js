/**
 * lang
 */

const hasOwn = Object.prototype.hasOwnProperty;
const toStr = Object.prototype.toString;
const arraySlice = Array.prototype.slice;

/**
 * 获取数据类型
 * @param {*} variable 
 * @return {String}
 */
function getType(variable) {
  return toStr.call(variable).replace(/\[object\s+(\w*)\]/, (m, $1) => $1);
}

/**
 * 判断是否字符串类型
 * @param {*} str
 * @return {Boolean}
 */
function isString(str) {
  return getType(str) === 'String';
}

/**
 * 判断是否数组
 * @param {*} arr
 * @return {Boolean}
 */
function isArray(arr) {
  return Array.isArray(arr);
}

/**
 * 判断是否函数
 * @param {*} fn
 * @return {Boolean}
 */
function isFunction(fn) {
  return typeof fn === 'function';
}

/**
 * 判断是否布尔类型
 * @param {*} bool
 * @return {Boolean}
 */
function isBoolean(bool) {
  return typeof bool === 'boolean';
}

/**
 * 判断是否对象
 * @param {*} obj
 * @return {Boolean}
 */
function isObject(obj) {
  return getType(obj) === 'Object';
}

/**
 * 首字母大写
 * @param {String} str
 * @return {String}
 */
function firstUpperCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  hasOwn,
  arraySlice,
  getType,
  isString,
  isObject,
  isArray,
  isFunction,
  isBoolean,
  firstUpperCase
};
