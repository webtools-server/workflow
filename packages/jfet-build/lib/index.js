/**
 * build plugin
 */

const pkg = require('../package.json');
const ContextBuild = require('./context');

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
    watch: {
        type: 'boolean',
        alias: 'w',
        describe: 'Watch file changes and rebuild',
        default: false
    }
};

// handler
plugin.handler = (configFunc, argv) => {
    const env = argv.watch ? 'watch' : 'build';
    const context = new ContextBuild(env);

    // jfet env
    process.env.JFET_ENV = env;

    // 执行配置函数
    configFunc(context);

    // 启动构建
    context.start();
};

module.exports = plugin;
