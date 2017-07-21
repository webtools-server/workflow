/**
 * 输出日志
 */

const chalk = require('chalk');
const utilLang = require('./lang');

/* eslint-disable no-console */
const logger = console.log;
const arrayJoin = Array.prototype.join;
const arraySlice = Array.prototype.slice;

const types = {
    info: {
        title: 'Info',
        color: 'green'
    },
    warn: {
        title: 'Warn',
        color: 'yellow'
    },
    error: {
        title: 'Error',
        color: 'red'
    }
};

/**
 * 创建日志类型
 * @param {String} type 
 * @param {Array} argv
 */
function createLog(type, argv) {
    const arrArgv = arraySlice.call(argv, 0);
    const logType = types[type];

    if (utilLang.isBoolean(arrArgv[arrArgv.length - 1])) {
        arrArgv.pop();
        logger(chalk[logType.color](`[${logType.title}]: ${arrayJoin.call(arrArgv, '  ')}`));
    } else {
        logger(chalk[logType.color](`${arrayJoin.call(arrArgv, '  ')}`));
    }
}

/**
 * Info类型日志
 */
function info() {
    createLog('info', arguments);
}

/**
 * Warn类型日志
 */
function warn() {
    createLog('warn', arguments);
}

/**
 * Error类型日志
 */
function error() {
    createLog('error', arguments);
}

module.exports = {
    info,
    warn,
    error
};
