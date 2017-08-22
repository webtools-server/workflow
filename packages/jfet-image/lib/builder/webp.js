/**
 * webp方案
 */

const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');
const co = require('co');
const imageminWebp = require('imagemin-webp');

const IMG_REGEX = /\.(png|jpg|jpeg)$/i;
const EXT_NAME = '.webp';

/**
 * webp方案
 * 1. png/jpg/jpeg格式转换为webp格式
 * 2. 根据转换前后图片大小决定是否替换
 * 3. 替换目录下css/js文件中的图片链接，生成新的css/js文件
 * 4. 模板里面先判断是否支持webp，如果支持，加载使用webp格式图片的css/js文件，不支持，则使用原来的图片格式的css/js文件
 */
module.exports = function (opts = {}) {
  let { output } = opts;
  const { pattern, options } = opts;
  const files = glob.sync(pattern);
  const datas = [];

  if (!path.isAbsolute(output)) {
    output = path.join(process.cwd(), output);
  }

  files.forEach((file) => {
    const ext = path.extname(file);

    if (IMG_REGEX.test(ext)) {
      const urlObj = path.parse(file);
      const buf = fse.readFileSync(file);

      datas.push(new Promise((resolve, reject) => {
        imageminWebp(options || {})(buf).then((data) => {
          try {
            fse.outputFileSync(path.join(output, urlObj.name + EXT_NAME), data);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }));
    }
  });

  return co(function* () {
    return yield datas;
  });
};
