/**
 * config
 */

const path = require('path');
const co = require('co');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const utilLog = require('../util/log');

const CONFIG_URL = path.join(__dirname, '..', 'config/config.json');
const optionConfig = {};

optionConfig.run = () => {
    co(function*() {
        const answers = yield configPrompt();
        const isWriteSucc = yield writeConfig(answers);

        if (isWriteSucc) {
            utilLog.info('配置写入成功');
        } else {
            utilLog.error('配置写入失败');
        }
    }).catch((err) => {
        utilLog.error(err);
        process.exit(1);
    });
};

function writeConfig(info) {
    return (cb) => {
        fse.writeJSON(CONFIG_URL, info, (err) => {
            if (err) {
                return cb(null, false);
            }

            cb(null, true);
        });
    };
}

function configPrompt() {
    const questions = [{
        type: 'input',
        name: 'repositoryURL',
        message: '请输入你的仓库地址（格式：https://github.com/fe-template）：'
    }];

    return (cb) => {
        inquirer.prompt(questions).then((answers) => {
            cb(null, answers);
        });
    };
}

module.exports = optionConfig;
