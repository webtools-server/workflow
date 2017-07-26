/**
 * 文件操作
 */

const fse = require('fs-extra');

/**
 * 判断文件是否存在
 * @param {String} filePath 文件路径
 * @return {Boolean}
 */
function fileExists(filePath) {
  try {
    return fse.statSync(filePath).isFile();
  } catch (e) {
    return false;
  }
}

/**
 * 读取文件内容
 * @param {String} filePath 文件路径
 * @return {String}
 */
function readFile(filePath) {
  try {
    return fse.readFileSync(filePath);
  } catch (e) {
    return '';
  }
}

module.exports = {
  fileExists,
  readFile
};
