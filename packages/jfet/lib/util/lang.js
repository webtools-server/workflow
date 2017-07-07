/**
 * lang
 */

function isFunction(fn) {
    return typeof fn === 'function';
}

function isBoolean(bool) {
    return typeof bool === 'boolean';
}

function firstUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
    isFunction,
    isBoolean,
    firstUpperCase
};
