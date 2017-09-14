/**
 * context
 */

const EventEmitter = require('events');
const ora = require('ora');
const stringifyObject = require('stringify-object');
const core = require('./core');
const utilLog = require('./util/log');
const _ = require('./util');
const co = require('co');
const constant = require('./constant');
const getModule = require('./util/get_module');

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
    // plugin
    this.plugins = [];
  }

  setPreset(preset) {
    if (!preset || !_.isString(preset) || !_.isFunction(preset.run)) {
      throw new Error('Preset name not be empty and must be string or object which have a run function.');
    }

    this.preset = preset;
  }

  usePlugin(plugin) {
    this.plugins.push(plugin);
  }

  dispatchPlugin() {
    const ctx = this;
    const plugins = this.plugins;
    let i = 0;

    function next(stop) {
      // run plugin end
      if (stop || plugins.length === i) {
        ctx.emit('end');
        return;
      }

      const plugin = plugins[i++];
      if (!_.isFunction(plugin)) return;
      plugin.call(ctx, next);
    }

    next();
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
    this.emit('created', stringifyObject(this.packConfig, {
      indent: '  ',
      singleQuotes: false
    }));
    utilLog.info('entry：');
    utilLog.info(JSON.stringify(this.packConfig.entry, null, 2));
    return this.packConfig;
  }

  start() {
    try {
      // spinner
      const spinner = ora('Build start: ');
      // spinner event
      this.on('spinner', (text) => {
        if (text) {
          spinner.text = text;
        } else {
          spinner.stop();
        }
      });

      spinner.start();
      // emit before event
      this.emit('before-emit');
      this.dispatchPlugin();
      this.startPreset();
      // emit after event
      this.emit('after-emit');
    } catch (e) {
      this.emit('error', e);
    }
  }

  startPreset() {
    const preset = this.preset;

    if (preset && _.isString(preset)) {
      const resources = PRESET_PREFIX.map(p => `${p}${preset}`);
      this.runPreset(getModule(resources));
    } else {
      this.runPreset(preset);
    }
  }

  runPreset(preset) {
    const that = this;

    if (preset && _.isFunction(preset.run)) {
      co(function* () {
        that.emit('spinner', 'Run preset...');
        // preset run
        that.emit('before');
        yield preset.run(core, that);
        that.emit('after');
        that.emit('spinner', false);
      });
    } else {
      utilLog.error('Preset must export run function.');
    }
  }
}

module.exports = ContextBuild;
