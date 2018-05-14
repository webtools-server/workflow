/**
 * command plugin
 */

const pkg = require('../package.json');

const plugin = {};

// name
plugin.name = 'demo';

// version
plugin.version = pkg.version;

// command
plugin.command = 'demo';

// describe
plugin.describe = 'demo command for jfet';

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
  if (argv.watch) {
    console.log('watch mode.');
  } else {
    console.log('normal mode.');
  }
  
  // 执行配置函数
  configFunc({});
};

module.exports = plugin;
