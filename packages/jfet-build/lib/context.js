/**
 * context
 */

const EventEmitter = require('events');
const co = require('co');
const ora = require('ora');
const core = require('./core');
const constant = require('./constant');
const getModule = require('./util/get_module');
const utilLog = require('./util/log');
const _ = require('./util');

const { PRESET_PREFIX } = constant;

class ContextBuild extends EventEmitter {
    constructor(env) {
        super();
        // 运行环境
        this.env = env || 'watch';
        // 默认preset为common
        this.preset = 'common';
        // 存储用户的设置
        this.configuration = {};
        // 打包配置，preset里面设置才会有
        this.packConfig = {};
        // block
        this.blocks = [];
    }

    setPreset(name) {
        if (!name || !_.isString(name)) {
            throw new Error('Preset name not be empty and must be string.');
        }

        this.preset = name;
    }

    setConfig(cfg) {
        if (!_.isObject(cfg)) {
            throw new Error('Config must be object.');
        }

        this.configuration = cfg;
    }

    addBlock(block) {
        this.blocks.push(block);
    }

    createConfig(initialContext, configSetters) {
        configSetters = configSetters.concat(this.blocks);
        this.packConfig = core.createConfig(initialContext, configSetters);
        this.emit('created', this.packConfig);
        return this.packConfig;
    }

    start() {
        const resources = PRESET_PREFIX.map(p => `${p}${this.preset}`);
        const preset = getModule(resources);
        const that = this;

        if (preset && _.isFunction(preset.run)) {
            co(function* () {
                try {
                    const spinner = ora('Build start\n').start();
                    // emit before event
                    that.emit('before');
                    spinner.text = 'Run preset...';
                    // preset run
                    yield preset.run(core, that);
                    // emit after event
                    that.emit('after');
                    spinner.stop();
                } catch (e) {
                    that.emit('error', e);
                }
            });
        } else {
            utilLog.error('Preset must export run function.');
        }
    }
}

module.exports = ContextBuild;
