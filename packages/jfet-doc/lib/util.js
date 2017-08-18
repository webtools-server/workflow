/**
 * 工具库
 */

const chalk = require('chalk');
const archiver = require('archiver');
const fse = require('fs-extra');

/**
 * 创建zip
 * @param {String} zipFile zip文件
 * @param {String} fileDir 文件目录
 * @return {Promise}
 */
function createZip(zipFile, fileDir) {
  return new Promise((resolve, reject) => {
    const outputZip = fse.createWriteStream(zipFile);
    const archive = archiver('zip');

    outputZip.on('close', () => {
      const size = archive.pointer();
      console.log(chalk.green(`Zip: ${zipFile}`));
      console.log(chalk.green(`${Math.round(size / 1024)} total kb`));
      resolve(size);
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.log(chalk.yellow(err));
      } else {
        reject(err);
      }
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(outputZip);
    archive.directory(fileDir, false);
    archive.finalize();
  });
}

module.exports = {
  createZip
};
