/**
 * 日志
 */

const chalk = require('chalk');

const logger = console.log;

/**
 * info log
 * @param {*} msg 
 */
function info(msg) {
    logger(chalk.green(msg));
}

/**
 * warn log
 * @param {*} msg 
 */
function warn(msg) {
    logger(chalk.yellow(msg));
}

/**
 * error log
 * @param {*} msg 
 */
function error(msg) {
    logger(chalk.red(msg));
}

module.exports = {
    info,
    warn,
    error
};
