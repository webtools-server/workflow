/**
 * 图片处理插件
 */

const path = require('path');
const webp = require('./builder/webp');

const pkg = require('../package.json');

const plugin = {};

// name
plugin.name = 'image';

// version
plugin.version = pkg.version;

// command
plugin.command = 'image';

// describe
plugin.describe = 'image command for jfet';

// builder
plugin.builder = {
  webp: {
    type: 'boolean',
    describe: 'Create webp image',
    default: false
  }
};

// handler
plugin.handler = (configFunc, argv) => {
  if (argv.webp) {
    webp({
      pattern: path.join(process.cwd(), 'demo/*.{jpg,png}'),
      output: path.join(process.cwd(), 'demo')
    });
    console.log('watch mode.');
  } else {
    console.log('normal mode.');
  }

  // 执行配置函数
  configFunc({});
};

module.exports = plugin;
