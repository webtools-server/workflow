/**
 * webp方案
 */

const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');
const glob = require('glob');
const co = require('co');
const uglifyJS = require('uglify-js');
const extend = require('extend');
const imageminWebp = require('imagemin-webp');

const IMG_REGEX = /\.(png|jpg|jpeg)$/i;
const EXT_NAME = '.webp';
const SUPPORT_WEBP_SCRIPT = path.join(__dirname, '..', 'static/support_webp.js');

// 默认配置
const defaultOptions = {
  img: { // 图片
    pattern: '',
    output: ''
  },
  css: { // css
    pattern: '',
    output: ''
  },
  tpl: { // 模板
    pattern: '',
    output: ''
  },
  webpOptions: {}
};

/**
 * webp方案
 * 1. png/jpg/jpeg格式转换为webp格式
 * 2. 根据转换前后图片大小决定是否替换
 * 3. 替换目录下css文件中的图片链接，生成新的css文件
 * 4. 模板里面先判断是否支持webp，如果支持，加载使用webp格式图片的css文件，不支持，则使用原来的图片格式的css文件
 */
module.exports = function (opts = {}) {
  opts = extend(true, {}, defaultOptions, opts);

  const { img: imgOptions, css: cssOptions, tpl: tplOptions, webpOptions } = opts;

  return co(function* () {
    const webpInfo = transformWebp(imgOptions, webpOptions);
    const { imgMap } = webpInfo;

    yield webpInfo.imgDatas;
    console.log(chalk.green('*转换为webp格式，根据转换前后图片大小决定是否替换'));
    console.log(chalk.green(JSON.stringify(imgMap)));
    replaceWebp(cssOptions, new RegExp(`(${Object.keys(imgMap).filter(img => imgMap[img]).join('|')})`, 'ig'));
    console.log(chalk.green('*替换目录下css文件中的图片链接，生成新的css文件'));
    replaceTpl(tplOptions);
    console.log(chalk.green('*替换模板link，注入判断代码'));
  });
};

/**
 * 转换webp
 * @param {Object} imgOptions
 * @param {String} output 输出目录
 * @param {String} options webp选项，see:https://github.com/imagemin/imagemin-webp
 */
function transformWebp(imgOptions, options) {
  let { output } = imgOptions;
  const files = glob.sync(imgOptions.pattern, { nodir: true });
  const imgDatas = []; // 图片处理promise
  const imgMap = {}; // 判断是否使用webp

  output = outputPreProcessor(output);
  files.forEach((file) => {
    const ext = path.extname(file);

    if (IMG_REGEX.test(ext)) {
      const pathObj = path.parse(file);
      const buf = fse.readFileSync(file);

      imgDatas.push(new Promise((resolve, reject) => {
        // 转为webp格式
        imageminWebp(options || {})(buf).then((data) => {
          try {
            fse.outputFileSync(path.join(output || pathObj.dir, pathObj.name + EXT_NAME), data);

            // 根据转换前后图片大小决定是否替换
            imgMap[pathObj.base] = buf.length > data.length;
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
 * @param {Object} cssOptions
 * @param {Regex} reg 替换图片
 */
function replaceWebp(cssOptions, reg) {
  let { output } = cssOptions;
  const files = glob.sync(cssOptions.pattern, { nodir: true });

  output = outputPreProcessor(output);
  files.forEach((file) => {
    let content = fse.readFileSync(file, 'utf-8');
    const pathObj = path.parse(file);

    content = content.replace(reg, (m) => {
      if (m) {
        return `${m.substring(0, m.lastIndexOf('.'))}.webp`;
      }
    });
    fse.outputFileSync(
      path.join(output || pathObj.dir, `${pathObj.name}.webp${pathObj.ext}`),
      content
    );
  });
}

/**
 * 替换模板link，注入判断代码
 * @param {Object} tplOptions
 */
function replaceTpl(tplOptions) {
  let { output } = tplOptions;
  const files = glob.sync(tplOptions.pattern, { nodir: true });

  output = outputPreProcessor(output);
  files.forEach((file) => {
    const supportScript = uglifyJS.minify(fse.readFileSync(SUPPORT_WEBP_SCRIPT, 'utf-8'));
    const pathObj = path.parse(file);
    let content = fse.readFileSync(file, 'utf-8');
    let firstIndex = 0;

    if (supportScript.error) {
      throw new Error(supportScript.error);
    }

    content = content.replace(/(link.*?)href/ig, '$1data-href');
    firstIndex = content.indexOf('</head>');
    content = content.substring(0, firstIndex) + wrapperScript(supportScript.code) + content.substring(firstIndex);
    fse.outputFileSync(
      path.join(output || pathObj.dir, pathObj.base),
      content
    );
  });
}

/**
 * script标签
 * @param {String} content 脚本内容
 * @return {String}
 */
function wrapperScript(content = '') {
  return `<script>${content}</script>`;
}

/**
 * 输出目录预处理
 * @param {String} output
 * @return {String}
 */
function outputPreProcessor(output) {
  if (output && !path.isAbsolute(output)) {
    output = path.join(process.cwd(), output);
  }
  return output;
}
