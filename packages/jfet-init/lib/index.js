/**
 * init plugin
 */

const optionConfig = require('./option/config');
const optionTemplate = require('./option/template');
const optionSearch = require('./option/search');
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
    search: {
        type: 'string',
        alias: 's',
        describe: 'Search template',
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
    }
};

// handler
plugin.handler = (configFunc, argv) => {
    console.log(argv);

    if (argv.config) {
        return optionConfig.run();
    }

    if (argv.ls) {
        return optionLS.run();
    }

    if (argv.template) {
        return optionTemplate.run({ template: argv.template });
    }

    if (argv.search) {
        return optionSearch.run({ template: argv.search });
    }
};

module.exports = plugin;
