/**
 * command plugin
 */

const LibContext = require('./context');
const pkg = require('../package.json');

const plugin = {};

// name
plugin.name = 'lib';

// version
plugin.version = pkg.version;

// command
plugin.command = 'lib';

// describe
plugin.describe = 'lib command for jfet';

// builder
plugin.builder = {
  test: {
    type: 'boolean',
    alias: 't',
    describe: 'Run unit testing',
    default: false
  },
  coverage: {
    type: 'boolean',
    alias: 'c',
    describe: 'Output coverage',
    default: false
  },
  build: {
    type: 'boolean',
    alias: 'b',
    describe: 'Run build',
    default: false
  },
  sourcemap: {
    type: 'boolean',
    alias: 's',
    describe: 'Create sourcemap file',
    default: false
  },
  min: {
    type: 'boolean',
    alias: 'm',
    describe: 'Uglify file',
    default: false
  },
  watch: {
    type: 'boolean',
    alias: 'w',
    describe: 'Watch file changes and rebuild',
    default: false
  }
};

// handler
plugin.handler = (configFunc, argv) => {
  const context = new LibContext(argv);
  // 设置环境
  process.env.JFET_ENV = argv.watch ? 'watch' : 'build';
  // 设置命令函数的参数
  configFunc.setParameter(context);
  // 执行命令函数
  configFunc.getConfig();
  // 启动构建
  context.start();
};

module.exports = plugin;
