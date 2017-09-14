/**
 * build plugin
 */

const pkg = require('../package.json');
const ContextBuild = require('./context');

const plugin = {};

// name
plugin.name = 'build';

// version
plugin.version = pkg.version;

// command
plugin.command = 'build';

// describe
plugin.describe = 'build command for jfet';

// builder
plugin.builder = {
  watch: {
    type: 'boolean',
    alias: 'w',
    describe: 'Watch file changes and rebuild',
    default: false
  }
};

// handler
plugin.handler = (configFunc, argv) => {
  const env = argv.watch ? 'watch' : 'build';
  const context = new ContextBuild(env);

  // 设置环境
  process.env.JFET_ENV = env;

  // 设置命令函数的参数
  configFunc.setParameter(context);
  // 执行命令函数
  configFunc.getConfig();
  // 启动构建
  context.start();
};

module.exports = plugin;
