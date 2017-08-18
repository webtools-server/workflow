/**
 * command plugin
 */

const path = require('path');
const execa = require('execa');
const fse = require('fs-extra');
const chalk = require('chalk');
const getStream = require('get-stream');
const co = require('co');
const FormStream = require('formstream');
const urllib = require('urllib');
const util = require('./util');
const pkg = require('../package.json');

const zipPath = path.join(__dirname, '..', 'zip');
const plugin = {};

// name
plugin.name = 'doc';

// version
plugin.version = pkg.version;

// command
plugin.command = 'doc';

// describe
plugin.describe = 'doc command for jfet';

// builder
plugin.builder = {
  serve: {
    type: 'boolean',
    alias: 's',
    describe: 'Gitbook serve',
    default: false
  },
  init: {
    type: 'boolean',
    alias: 'i',
    describe: 'Gitbook init',
    default: false
  }
};

// handler
plugin.handler = (configuration, argv) => {
  // 得到配置
  const cfg = getConfiguration(configuration);

  // gitbook serve
  if (argv.serve) {
    execa('gitbook', ['serve']).stdout.pipe(process.stdout);
    return false;
  }

  // gitbook init
  if (argv.init) {
    execa('gitbook', ['init']).stdout.pipe(process.stdout);
    return false;
  }

  if (!cfg.name || !cfg.token || !cfg.uploadUrl) {
    return console.log(chalk.red('name,token,uploadUrl必须填写'));
  }

  // gitbook build
  const stream = execa('gitbook', ['build']).stdout;
  const zipFullName = path.join(zipPath, `${Date.now()}.zip`);

  stream.pipe(process.stdout);
  co(function* () {
    try {
      const form = new FormStream();
      let result = null;

      // 新建zip目录
      fse.ensureDirSync(zipPath);
      yield getStream(stream);

      // 创建压缩包
      yield util.createZip(zipFullName, path.join(process.cwd(), '_book'));

      // 设置name,token,file
      form.field('name', cfg.name);
      form.field('token', cfg.token);
      form.file('file', zipFullName);

      // 提交
      result = yield urllib.request(cfg.uploadUrl, {
        method: 'POST',
        headers: form.headers(),
        stream: form
      });

      result = JSON.parse(result.data.toString('utf-8'));
      if (result.code) {
        console.log(chalk.green(result.msg));
      } else {
        console.log(chalk.red(result.msg));
      }
    } catch (e) {
      console.log(chalk.red(e));
    }

    // 移除压缩包
    yield fse.remove(zipFullName);
  });
};

/**
 * 获取配置
 * @param {Object} cfg
 * @return {Object}
 */
function getConfiguration(cfg = {}) {
  let configuration = cfg;

  if (typeof cfg === 'function') {
    configuration = cfg();
  }

  return configuration || {};
}

module.exports = plugin;
