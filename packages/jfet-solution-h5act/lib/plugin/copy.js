/**
 * 构建发布复制插件
 */

const fse = require('fs-extra');
const path = require('path');

const cwd = process.cwd();

/* eslint-disable space-before-function-paren */
module.exports = function(options) {
  const defaultOptions = {
    copy: [],
    isRelease: false,
    copyFrom: '',
    copyTo: ''
  };
  const opts = Object.assign({}, defaultOptions, options);

  return function(next) {
    this.on('before', () => {
      fse.emptyDirSync(opts.copyFrom);
    });

    this.on('after', () => {
      (opts.copy || []).forEach(file => fse.copySync(path.join(cwd, file.from), path.join(cwd, file.to)));
      if (opts.isRelease) {
        fse.removeSync(opts.copyTo);
        fse.copySync(opts.copyFrom, opts.copyTo);
      }
    });

    this.on('error', (e) => {
      console.error(e);
    });
    next();
  };
};
