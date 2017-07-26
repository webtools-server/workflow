/**
 * util
 */

const toStr = Object.prototype.toString;

function isPromise(p) {
  return toStr.call(p) === '[object Promise]';
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function isString(str) {
  return typeof str === 'string';
}

function isObject(obj) {
  return toStr.call(obj) === '[object Object]';
}

module.exports = {
  isPromise,
  isString,
  isObject,
  isFunction
};
