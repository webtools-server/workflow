/**
 * copyShtml
 */

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

module.exports = function (options) {
  const defaultOptions = {
    dir: __dirname,
    disabled: false
  };
  const opts = Object.assign({}, defaultOptions, options);

  return function (next) {
    this.on('after', () => {
      if (opts.disabled) return;

      const dir = opts.dir;
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const stat = fs.statSync(path.join(dir, file));
        if (stat && stat.isFile() && /.html/.test(file)) {
          fse.copySync(path.join(dir, file), path.join(dir, file.replace('html', 'shtml')));
        }
      });
    });
    next();
  };
};
