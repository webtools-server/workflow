/**
 * build plugin
 */

const pkg = require('../package.json');

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
    config: {
        type: 'boolean',
        alias: 'c',
        describe: 'Configuration personal infomation',
        default: false
    }
};

// handler
plugin.handler = (configFunc, argv) => {
    
};

module.exports = plugin;
