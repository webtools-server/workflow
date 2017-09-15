/**
 * 执行预设插件
 */

const co = require('co');
const core = require('../core');
const utilLog = require('../util/log');
const _ = require('../util');
const constant = require('../constant');
const getModule = require('../util/get_module');

const { PRESET_PREFIX } = constant;

/* eslint-disable space-before-function-paren */
module.exports = function(options) {
  const defaultOptions = {
    preset: 'common'
  };
  const opts = Object.assign({}, defaultOptions, options);

  return function(next) {
    const preset = opts.preset;

    if (preset && _.isString(preset)) {
      const resources = PRESET_PREFIX.map(p => `${p}${preset}`);
      runPreset(this, getModule(resources), next);
    } else {
      runPreset(this, preset, next);
    }
  };
};

function runPreset(ctx, preset, next) {
  if (preset && _.isFunction(preset.run)) {
    co(function* () {
      ctx.emit('spinner', 'Run preset...');
      // preset run
      ctx.emit('before');
      yield preset.run(core, ctx);
      ctx.emit('after');
      ctx.emit('spinner', false);
      next();
    });
  } else {
    utilLog.error('Preset must export run function.');
    next();
  }
}
