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
  }
};

// handler
plugin.handler = (configFunc, argv) => {
  const serve = new Server(argv.cwd, argv.port, argv.ssi, argv.livereload);

  configFunc({
    setConfig: serve.setConfig.bind(serve),
    registerRouter: serve.registerRouter.bind(serve),
    proxy: serve.proxy.bind(serve)
  });
  serve.start();
};

module.exports = plugin;
