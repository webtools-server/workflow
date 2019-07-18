/**
 * 命令
 */

const path = require('path');
const utilFs = require('../util/fs');
const utilLog = require('../util/log');
const utilLang = require('../util/lang');
const util = require('../util');
const constant = require('../constant');

const cwd = process.cwd();
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

    this.jfetOptions = {}; // jfet选项配置
    this.abcOptions = {}; // abc.json选项配置
    this.name = name;
    this.plugin = null;

    // 获取工具选项
    this.getJfetOptions();
  }

  /**
   * 获取选项
   */
  getJfetOptions() {
    const pkgOptions = utilFs.tryRequire(path.join(cwd, 'package.json')) || {};
    const abcOptions = utilFs.tryRequire(path.join(cwd, 'abc.json')) || {};

    this.abcOptions = abcOptions;
    this.jfetOptions = Object.assign({}, pkgOptions.jfetOptions, abcOptions.jfetOptions);
    return this.jfetOptions;
  }

  /**
   * 加载插件
   * @param {String} name
   * @return {Object|Null}
   */
  loadPlugin() {
    let plugin = null;
    const jfetOptions = this.jfetOptions;
    const name = this.name;

    // 校验插件名称
    if (!PLUGIN_NAME_REGEX.test(name)) {
      return utilLog.error('Plugin name error. It should be a-z and 0-9.', true);
    }
    console.log('loadPlugin' + cwd)

    // 如果存在commandPlugin选项，优先加载该路径的插件
    if (jfetOptions.commandPlugin) {
      plugin = util.loadPackage(path.join(cwd, jfetOptions.commandPlugin));
    } else {
      plugin = util.loadPackage(COMMAND_PREFIX.map(c => `${c}${name}`));
    }

    // 获取到的插件名称和输入名称一致
    if (plugin && plugin.name === name) {
      this.plugin = plugin;
    }

    return this.plugin;
  }

  /**
   * 检测命令字段
   * @return {Object}
   */
  validPlugin() {
    const obj = this.plugin || {};
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
        type: ['Object', 'Function'],
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

        const currFieldRuleType = rules[k].type;
        const currRuleType = utilLang.getType(obj[k]);
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
