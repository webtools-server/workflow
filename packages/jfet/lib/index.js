/**
 * 命令行入口
 */

const path = require('path');
const yargs = require('yargs');
const figlet = require('figlet');

// util
const utilFs = require('./util/fs');
const utilLog = require('./util/log');
const utilLang = require('./util/lang');

const Command = require('./command');
const constant = require('./constant');
const pkg = require('../package.json');

const { TOOL_NAME, TOOL_USAGE, CONFIG_FILES } = constant;

const cwd = process.cwd();
const cli = {};

function noop() {}

cli.run = (option) => {
  const ys = yargs.usage(TOOL_USAGE).version().help();

  // 输出版本
  if (option === '-v' || option === '--version') {
    showText();
    return utilLog.info(pkg.version);
  }

  // help
  if (!option || option === '-h' || option === '--help') {
    return ys.showHelp();
  }

  // 初始化命令
  const command = new Command(option);
  // 加载插件
  const commandPlugin = command.loadPlugin();
  // 检验命令所需字段
  const validResult = command.validPlugin();

  // 校验插件错误
  if (!validResult.status) {
    return utilLog.error(validResult.error.join('\n'));
  }

  // 读取配置文件
  const configuration = utilFs.tryRequire(path.join(cwd, command.jfetOptions.configFilePath || '', CONFIG_FILES));
  let configurationFunc = noop; // 初始配置函数
  let newConfigurationFunc = noop; // 新的配置函数

  if (utilLang.isObject(configuration)) {
    const currentCommandConfig = configuration[option];

    // 配置的格式支持函数和对象
    if (utilLang.isFunction(currentCommandConfig)) {
      configurationFunc = currentCommandConfig;
    } else if (utilLang.isObject(currentCommandConfig)) {
      configurationFunc = () => currentCommandConfig;
    }
  }

  // module.exports = { command(abc, context) {}  }
  // module.exports = { command: {} }
  newConfigurationFunc = configurationFunc.bind(null, command.abcOptions[commandPlugin.name]);
  installConfigurationAPI(newConfigurationFunc);

  /* eslint-disable no-unused-expressions */
  yargs.reset().command({
    command: commandPlugin.command,
    describe: commandPlugin.describe,
    builder: commandPlugin.builder,
    handler() {
      const args = utilLang.arraySlice.call(arguments, 0);

      // 增加abc参数
      args.unshift(newConfigurationFunc);
      commandPlugin.handler.apply(null, args);
    }
  }).version(() => commandPlugin.version).help().argv;
};

/**
 * 配置函数挂载API
 * @param {Function} func
 */
function installConfigurationAPI(func) {
  let params = null;
  let config = null;

  // 设置参数
  func.setParameter = (...args) => {
    params = args;
  };

  // 获取配置
  func.getConfig = () => {
    if (!config) {
      config = func(...params);
    }
    return config;
  };
}

/**
 * 显示工具名称
 */
function showText() {
  const fonts = figlet.textSync(TOOL_NAME, {
    font: 'Standard',
    horizontalLayout: 'full',
    verticalLayout: 'full',
    kerning: 'full'
  });

  utilLog.info(fonts);
}

module.exports = cli;
