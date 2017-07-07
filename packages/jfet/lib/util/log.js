/**
 * 输出日志
 */

require('colors');

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

function createLog(type, argv) {
    const arrArgv = arraySlice.call(argv, 0);
    const logType = types[type];

    if (utilLang.isBoolean(arrArgv[arrArgv.length - 1])) {
        arrArgv.pop();
        logger((`[${logType.title}]: ${arrayJoin.call(arrArgv, '  ')}`)[logType.color]);
    } else {
        logger((`${arrayJoin.call(arrArgv, '  ')}`)[logType.color]);
    }
}

function info() {
    createLog('info', arguments);
}

function warn() {
    createLog('warn', arguments);
}

function error() {
    createLog('error', arguments);
}

module.exports = {
    info,
    warn,
    error
};
