/**
 * ssi
 */

const SSI = require('node-ssi');
const path = require('path');
const urlModule = require('url');

module.exports = function koaSSI(currentPath, opt) {
  // see https://github.com/yanni4night/node-ssi
  opt = Object.assign({}, {
    baseDir: '.',
    ext: '.shtml'
  }, opt);

  const ssi = new SSI(opt);

  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  return function* (next) {
    let url = urlModule.parse(this.request.path).pathname;

    url = /\/$/.test(url) ? (`${url}index${opt.ext}`) : url;
    if (!endsWith(url, opt.ext)) {
      return yield* next;
    }

    const that = this;
    const filePath = path.join(currentPath, url);

    try {
      yield compileFile();
    } catch (e) {
      return yield* next;
    }

    function compileFile() {
      return new Promise((resolve, reject) => {
        ssi.compileFile(filePath, (err, content) => {
          if (err) {
            if (err.code === 'ENOENT' && err.path === filePath) {
              return reject(err);
            }

            return reject(err);
          }

          that.set('Content-Type', 'text/html; charset=UTF-8');
          that.body = content;
          resolve();
        });
      });
    }
  };
};
