/**
 * 图片处理插件
 */

const webpBuilder = require('./builder/webp');
const minBuilder = require('./builder/min');

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
  },
  min: {
    type: 'boolean',
    describe: 'Minify images',
    default: false
  }
};

// handler
plugin.handler = (configFunc, argv) => {
  const cfg = configFunc.getConfig() || {};

  // 图片压缩优化
  if (argv.min) {
    minBuilder(cfg.min);
  }

  // webp方案
  if (argv.webp) {
    webpBuilder(cfg.webp);
  }
};

module.exports = plugin;
