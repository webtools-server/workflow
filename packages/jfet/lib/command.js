/**
 * 命令
 */

const path = require('path');
const utilFs = require('./util/fs');
const utilLog = require('./util/log');
const utilLang = require('./util/lang');
const constant = require('./constant');

const cwd = process.cwd();
const currPkgFile = path.join(cwd, 'package.json');
const PLUGIN_NAME_REGEX = /^[a-z0-9]+$/;
const { COMMAND_PREFIX } = constant;

class Command {
    /**
     * 命令
     * @param {String} name 名称
     * @return {Object} context
     */
    constructor(name) {
        if (!utilLang.isString(name)) {
            throw new Error('Name is required and string type.');
        }

        this.name = name;
    }

    /**
     * 加载命名
     * @param {String} name
     * @return {Object|Null}
     */
    load() {
        let jfetOptions = {};

        // 当前目录存在package.json文件，获取jfetOptions字段
        if (utilFs.fileExists(currPkgFile)) {
            const currPkg = require(currPkgFile);
            jfetOptions = currPkg.jfetOptions || {};
        }

        // jfet-build @jyb/jfet-build
        const name = this.name;

        // check name
        if (!PLUGIN_NAME_REGEX.test(name)) {
            return utilLog.error('Plugin name error. It should be a-z and 0-9.', true);
        }

        if (jfetOptions.commandPlugin) {
            const plugin = this.requireFile([path.join(cwd, jfetOptions.commandPlugin)]);
            return (plugin.name === this.name) ? plugin : null;
        }

        return this.requireFile(COMMAND_PREFIX.map(c => `${c}${name}`));
    }

    /**
     * 加载资源
     * @param {Array} resources 
     * @return {Object|Null}
     */
    requireFile(resources) {
        const err = [];
        let result = null;

        for (let i = 0, l = resources.length; i < l; i++) {
            try {
                result = require(resources[i]);
                return result;
            } catch (e) {
                err.push(e);
            }
        }

        utilLog.error(err.join('\n'));
        return result;
    }

    /**
     * 检测命令字段
     * @param {Object} obj 
     * @return {Object}
     */
    valid(obj) {
        const validError = [];
        const rules = {
            name: {
                type: 'String',
                required: true
            },
            version: {
                type: 'String',
                required: true
            },
            command: {
                type: ['String', 'Array'],
                required: true
            },
            describe: {
                type: 'String',
                required: true
            },
            builder: {
                type: 'Object',
                required: true
            },
            handler: {
                type: 'Function',
                required: true
            }
        };

        for (const k in rules) {
            if (rules[k].required && !utilLang.hasOwn.call(obj, k)) {
                validError.push(`${k} is required.`);
            }
        }

        if (validError.length === 0) {
            for (const k in obj) {
                /* eslint-disable no-continue */
                if (!utilLang.hasOwn.call(obj, k) || !utilLang.hasOwn.call(rules, k)) {
                    continue;
                }

                const curr = obj[k];
                const currFieldRule = rules[k];
                const currFieldRuleType = currFieldRule.type;
                const currRuleType = utilLang.getType(curr);
                const isArr = utilLang.isArray(currFieldRuleType);

                if ((isArr && (currFieldRuleType.indexOf(currRuleType) === -1)) ||
                    (!isArr && (currRuleType !== currFieldRuleType))) {
                    validError.push(`${k} type should be ${currFieldRuleType}.`);
                }
            }
        }

        return {
            status: !validError.length,
            error: validError
        };
    }
}

module.exports = Command;
