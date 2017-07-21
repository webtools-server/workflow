/**
 * config
 */

const path = require('path');
const co = require('co');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const utilLog = require('../util/log');
const config = require('../config');

const CONFIG_URL = path.join(__dirname, '..', 'config/config.json');
const optionConfig = {};

/**
 * 配置
 */
optionConfig.run = () => {
    co(function* () {
        try {
            const answers = yield configPrompt();
            fse.outputFileSync(CONFIG_URL, JSON.stringify(answers, null, 4));
            utilLog.info('配置写入成功');
        } catch (e) {
            utilLog.error('配置写入失败');
        }
    }).catch((err) => {
        utilLog.error(err);
        process.exit(1);
    });
};

/**
 * 配置引导
 */
function configPrompt() {
    return new Promise((resolve) => {
        inquirer.prompt(config.questions).then((answers) => {
            resolve(answers);
        });
    });
}

module.exports = optionConfig;
