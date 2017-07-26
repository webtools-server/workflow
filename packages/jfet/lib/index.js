/**
 * 命令行入口
 */

const path = require('path');
const yargs = require('yargs');
const figlet = require('figlet');

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

  if (option === '-v' || option === '--version') {
    showText();
    return utilLog.info(pkg.version);
  }

  if (!option || option === '-h' || option === '--help') {
    return ys.showHelp();
  }

  // 初始化命令
  const command = new Command(option);
  const commandPlugin = command.load();

  if (commandPlugin) {
    // 检验命令所需字段
    const valid = command.valid(commandPlugin);

    if (!valid.status) {
      return utilLog.error(valid.error.join('\n'));
    }

    // 读取配置
    let configuration = null;
    let configurationFunc = noop;
    const abcOptions = command.abcOptions;
    const abcJfetOptions = abcOptions.jfetOptions || {};
    const configFilePath = abcJfetOptions.configFilePath || command.pkgOptions.configFilePath || '';
    const configFiles = path.join(cwd, configFilePath, CONFIG_FILES);

    if (utilFs.fileExists(configFiles)) {
      configuration = require(configFiles) || {};
    }

    if (utilLang.isObject(configuration) && utilLang.isFunction(configuration[option])) {
      configurationFunc = configuration[option];
    }

    /* eslint-disable no-unused-expressions */
    yargs.reset().command({
      command: commandPlugin.command,
      describe: commandPlugin.describe,
      builder: commandPlugin.builder,
      handler() {
        const args = utilLang.arraySlice.call(arguments, 0);

        args.unshift(configurationFunc.bind(null, abcOptions[commandPlugin.name]));
        commandPlugin.handler.apply(null, args);
      }
    }).version(() => commandPlugin.version).help().argv;
  } else {
    utilLog.error(`${option} command plugin not found.`, true);
  }
};

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
