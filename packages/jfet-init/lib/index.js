/**
 * init plugin
 */

const optionConfig = require('./option/config');
const optionTemplate = require('./option/template');
const optionLS = require('./option/ls');
const pkg = require('../package.json');

const plugin = {};

// name
plugin.name = 'init';

// version
plugin.version = pkg.version;

// command
plugin.command = 'init';

// describe
plugin.describe = 'init command for jfet';

// builder
plugin.builder = {
    config: {
        type: 'boolean',
        alias: 'c',
        describe: 'Configuration personal infomation',
        default: false
    },
    template: {
        type: 'string',
        alias: 't',
        describe: 'Init project from template',
        default: ''
    },
    ls: {
        type: 'boolean',
        describe: 'Show all template',
        default: false
    },
    force: {
        type: 'boolean',
        alias: 'f',
        describe: 'Force clean current directory',
        default: false
    },
    output: {
        type: 'string',
        alias: 'o',
        describe: 'Output path',
        default: ''
    }
};

// handler
plugin.handler = (configFunc, argv) => {
    if (argv.config) {
        return optionConfig.run();
    }

    if (argv.ls) {
        return optionLS.run({
            output: argv.output,
            force: argv.force
        });
    }

    if (argv.template) {
        return optionTemplate.run({
            template: argv.template,
            output: argv.output,
            force: argv.force
        });
    }
};

module.exports = plugin;
