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
        default: true
    }
};

// handler
plugin.handler = (configFunc, argv) => {
    const serve = new Server(argv.cwd, argv.port, argv.livereload);

    configFunc({
        registerRouter: serve.registerRouter,
        proxy: serve.proxy
    });
    serve.start();
};

module.exports = plugin;
