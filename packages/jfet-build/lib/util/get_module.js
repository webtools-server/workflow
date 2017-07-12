/**
 * 获取模块
 */

const utilLog = require('./log');

function getModule(resources) {
    const err = [];
    let result = null;

    for (let i = 0, l = resources.length; i < l; i++) {
        try {
            result = require(resources[i]);
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
