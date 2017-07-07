/**
 * 命令行入口
 */

require('./global');

const pkg = require('../package.json');
const path = require('path');
const fse = require('fs-extra');
const utilFs = require('./util/fs');
const log = require('./util/log');
const utilLang = require('./util/lang');

const cwd = process.cwd();
const cli = {};

cli.run = (option) => {
    if (option === '-v' || option === '--version') {
        return log.info(pkg.version);
    }

    if (!option || option === '-h' || option === '--help') {
        return help();
    }

    // 读取配置
    let getConfig = null;
    const configFiles = path.join(cwd, CONFIG_FILES);
    const command = getCommand(option);

    // const jfet = new Project();
    /**
     * class Project {
     *   constructor() {
     *     this.config = null;
     *   }
     *   set(config) {
     *     this.config = config || {};
     *   }
     * }
     */

    if (utilFs.fileExists(configFiles)) {
        getConfig = utilFs.readFile(configFiles) || {};
    }

    if (utilLang.isFunction(getConfig)) {
        getConfig(jfet);
    }

    if (command.name === option && utilLang.isFunction(command.run)) {
        command.run(jfet.config[option]());
    } else {
        log.error('');
    }
};

function getCommand(name) {
    // jfet-build @jyb/jfet-build
    const names = [`${COMMAND_PREFIX}${name}`, `${JYB_COMMAND_PREFIX}${name}`];
    const err = [];
    let command = null;

    for (let i = 0, l = names.length; i < l; i++) {
        try {
            command = require(names[i]);
        } catch (e) {
            err.push(e);
        }
    }

    if (!command) {
        log.error(err.join(';'), true);
    }

    return command;
}

function help() {

}

module.exports = cli;
