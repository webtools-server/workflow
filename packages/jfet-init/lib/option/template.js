/**
 * init
 */

const utilLog = require('../util/log');
const generate = require('../common/generate');

const optionTemplate = {};
const URL_REGEX = /^(http|https):\/\//;

/**
 * 通过URL创建项目
 * @param {Object} opts
 * @param {String} template 模板地址
 * @param {String} output 输出路径
 * @param {Boolean} force 是否先清空输出路径
 */
optionTemplate.run = (opts) => {
    const { template, output, force } = opts;

    if (URL_REGEX.test(template)) {
        generate(template, template, output, force);
    } else {
        utilLog.error('URL format error.');
    }
};

module.exports = optionTemplate;
