/**
 * pack plugin
 */

const Pack = require('./pack');
const pkg = require('../package.json');

const plugin = {};

// name
plugin.name = 'pack';

// version
plugin.version = pkg.version;

// command
plugin.command = 'pack';

// describe
plugin.describe = 'pack command for jfet';

// builder
plugin.builder = {
  full: {
    type: 'boolean',
    alias: 'f',
    describe: 'Pack full package',
    default: false
  }
};

// handler
plugin.handler = (configFunc, argv) => {
  const pack = new Pack(argv);

  configFunc({ setConfig: pack.setConfig.bind(pack) });
  pack.start();
};

module.exports = plugin;
