/**
 * command plugin
 */

const path = require('path');
const execa = require('execa');
const fse = require('fs-extra');
const chalk = require('chalk');
const co = require('co');
const FormStream = require('formstream');
const urllib = require('urllib');
const util = require('./util');
const defaultOptions = require('./options');
const pkg = require('../package.json');

const root = path.join(__dirname, '..');
const gitbookBin = path.join(root, 'node_modules', '.bin', 'gitbook');
const zipPath = path.join(root, 'zip');
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
    describe: 'gitbook serve',
    default: false
  },
  init: {
    type: 'boolean',
    describe: 'gitbook init',
    default: false
  },
  install: {
    type: 'boolean',
    describe: 'gitbook install',
    default: false
  },
  build: {
    type: 'boolean',
    describe: 'gitbook build',
    default: false
  },
  name: {
    type: 'string',
    describe: 'book name',
    default: ''
  },
  token: {
    type: 'string',
    describe: 'docs-server token',
    default: ''
  }
};

// handler
plugin.handler = (configuration, argv) => {
  // 得到配置
  const cfg = Object.assign({}, defaultOptions, getConfiguration(configuration, argv));
  let stream = null;

  co(function* () {
    const zipName = `${Date.now()}.zip`;
    const zipFullName = path.join(zipPath, zipName);

    try {
      // gitbook serve
      if (argv.serve) {
        stream = execa(gitbookBin, ['serve']).stdout;
        yield getStream(stream);
        return false;
      }

      // gitbook init
      if (argv.init) {
        stream = execa(gitbookBin, ['init']).stdout;
        yield getStream(stream);
        return false;
      }

      // gitbook install
      if (argv.install) {
        stream = execa(gitbookBin, ['install']).stdout;
        yield getStream(stream);
        return false;
      }

      // gitbook build
      if (!argv.build) {
        console.log(chalk.green(`${pkg.name}，${pkg.description}`));
        return false;
      }

      if (!validFields(cfg)) {
        return false;
      }

      stream = execa(gitbookBin, ['build']).stdout;
      stream.pipe(process.stdout);
      yield getStream(stream);

      const form = new FormStream();
      let result = null;

      // 新建zip目录
      fse.ensureDirSync(zipPath);
      // 创建压缩包
      yield util.createZip(zipFullName, zipName, path.join(process.cwd(), '_book'));
      // 设置name,token,file
      form.field('name', cfg.name);
      form.field('token', cfg.token);
      form.file('file', zipFullName);
      // 提交
      result = yield urllib.request(cfg.uploadUrl, {
        method: 'POST',
        headers: form.headers(),
        stream: form,
        timeout: cfg.timeout || 5000
      });

      console.log(result.data.toString('utf-8'));
    } catch (e) {
      console.log(chalk.red(e));
    }

    // 移除压缩包
    yield fse.remove(zipFullName);
  });
};

/**
 * 校验输入
 * @param {Object} cfg
 */
function validFields(cfg) {
  if (!/^[a-zA-Z0-9\-_]+$/.test(cfg.name)) {
    console.log(chalk.red('name格式有误，必须为a-zA-Z0-9_-'));
    return false;
  }

  if (!cfg.token) {
    console.log(chalk.red('token必须填写'));
    return false;
  }

  if (!cfg.uploadUrl) {
    console.log(chalk.red('uploadUrl必须填写'));
    return false;
  }

  return true;
}

/**
 * 获取steam
 * @param {Object} stream
 */
function getStream(stream) {
  return new Promise((resolve, reject) => {
    stream.pipe(process.stdout);
    stream.on('end', () => {
      resolve();
    });

    stream.on('error', (e) => {
      reject(e);
    });
  });
}

/**
 * 获取配置
 * @param {Object} cfg 配置文件的配置
 * @param {Object} config 命令行配置
 * @return {Object} 真实配置
 */
function getConfiguration(cfg = {}, config = {}) {
  let configuration = cfg;

  if (typeof cfg === 'function') {
    configuration = cfg();
  }

  if (!configuration) {
    configuration = {};
  }

  for (const k in config) {
    if (config[k]) {
      configuration[k] = config[k];
    }
  }

  return configuration;
}

module.exports = plugin;
