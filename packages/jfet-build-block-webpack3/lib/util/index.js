/**
 * util
 */

/**
 * 判断数组是否全为函数类型
 * @param {Array} params
 * @return {Boolean}
 */
function isArrayOfFunc(params) {
    if (!Array.isArray(params)) {
        return false;
    }

    for (let i = 0, l = params.length; i < l; i++) {
        if (typeof params[i] !== 'function') {
            return false;
        }
    }

    return true;
}

module.exports = {
    isArrayOfFunc
};
