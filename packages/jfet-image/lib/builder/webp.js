/**
 * webp方案
 */

const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');
const glob = require('glob');
const co = require('co');
const uglifyJS = require('uglify-js');
const imageminWebp = require('imagemin-webp');

const IMG_REGEX = /\.(png|jpg|jpeg)$/i;
const EXT_NAME = '.webp';

const defaultOptions = {
  imgPattern: '',
  cssPattern: '',
  output: '_webp',
  options: {}
};

/**
 * webp方案
 * 1. png/jpg/jpeg格式转换为webp格式
 * 2. 根据转换前后图片大小决定是否替换
 * 3. 替换目录下css文件中的图片链接，生成新的css文件
 * 4. 模板里面先判断是否支持webp，如果支持，加载使用webp格式图片的css文件，不支持，则使用原来的图片格式的css文件
 */
module.exports = function (opts = {}) {
  opts = Object.assign({}, defaultOptions, opts);

  const { imgPattern, cssPattern, tplPattern, output, options } = opts;

  if (!imgPattern) {
    return console.log(chalk.red('imgPattern必须设置'));
  }

  return co(function* () {
    const webpInfo = transformWebp(imgPattern, output, options);
    const { imgMap } = webpInfo;

    yield webpInfo.imgDatas;
    replaceWebp(cssPattern, new RegExp(`(${Object.keys(imgMap).filter(img => imgMap[img]).join('|')})`, 'ig'));
    replaceTpl(tplPattern);
    console.log(imgMap);
  });
};

function replaceTpl(tplPattern) {
  const files = glob.sync(tplPattern, { nodir: true });
  files.forEach((file) => {
    let content = fse.readFileSync(file, 'utf-8');
    content = content.replace(/(link.*?)href/ig, '$1data-href');
    fse.outputFileSync(file, content);
  });
}

/**
 * 转换webp
 * @param {String} imgPattern glob pattern
 * @param {String} output 输出目录
 * @param {String} options webp选项，see:https://github.com/imagemin/imagemin-webp
 */
function transformWebp(imgPattern, output, options) {
  const files = glob.sync(imgPattern, { nodir: true });
  const imgDatas = []; // 图片处理promise
  const imgMap = {}; // 判断是否使用webp

  if (!path.isAbsolute(output)) {
    output = path.join(process.cwd(), output);
  }

  files.forEach((file) => {
    const ext = path.extname(file);

    if (IMG_REGEX.test(ext)) {
      const urlObj = path.parse(file);
      const buf = fse.readFileSync(file);

      imgDatas.push(new Promise((resolve, reject) => {
        // 转为webp格式
        imageminWebp(options || {})(buf).then((data) => {
          try {
            fse.outputFileSync(path.join(output, urlObj.name + EXT_NAME), data);

            // 根据转换前后图片大小决定是否替换
            imgMap[urlObj.base] = buf.length > data.length;

            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }));
    }
  });

  return {
    imgDatas,
    imgMap
  };
}

/**
 * 替换目录下css文件中的图片链接，生成新的css文件
 * @param {String} cssPattern  glob pattern
 * @param {Regex} reg 替换图片
 */
function replaceWebp(cssPattern, reg) {
  const files = glob.sync(cssPattern, { nodir: true });
  files.forEach((file) => {
    let content = fse.readFileSync(file, 'utf-8');
    const lastIndex = file.lastIndexOf('.');

    content = content.replace(reg, (m) => {
      if (m) {
        return `${m.substring(0, m.lastIndexOf('.'))}.webp`;
      }
    });
    fse.outputFileSync(
      `${file.substring(0, lastIndex)}.webp${file.substring(lastIndex)}`,
      content
    );
  });
}
