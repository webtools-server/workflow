/**
 * server plugin
 */

const Server = require('./server');
const pkg = require('../package.json');

const plugin = {};

// name
plugin.name = 'server';

// version
plugin.version = pkg.version;

// command
plugin.command = 'server';

// describe
plugin.describe = 'server command for jfet';

// builder
plugin.builder = {
  cwd: {
    type: 'string',
    alias: 'c',
    describe: 'Configuration root config',
    default: ''
  },
  port: {
    type: 'number',
    alias: 'p',
    describe: 'Configuration server port',
    default: 3000
  },
  livereload: {
    type: 'boolean',
    alias: 'l',
    describe: 'Start liveReload',
    default: false
  },
  ssi: {
    type: 'boolean',
    alias: 's',
    describe: 'Support server side includes',
    default: false
  },
  ssl: {
    type: 'boolean',
    describe: 'Use https',
    default: false
  }
};

// handler
plugin.handler = (configFunc, argv) => {
  const serve = new Server(argv);

  configFunc.setParameter({
    setConfig: serve.setConfig.bind(serve),
    registerRouter: serve.registerRouter.bind(serve),
    proxy: serve.proxy.bind(serve),
    instance: serve
  });
  configFunc.getConfig();
  serve.start();
};

module.exports = plugin;
