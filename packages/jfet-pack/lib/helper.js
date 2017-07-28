/**
 * pack helper
 */

const chalk = require('chalk');
const archiver = require('archiver');
const fse = require('fs-extra');
const path = require('path');
const util = require('./util');

/**
 * 创建zip
 * @param {String} zipFile zip文件
 * @param {String} outputPath 输出路径
 * @return {Promise}
 */
function createZip(zipFile, outputPath) {
  return new Promise((resolve, reject) => {
    const outputZip = fse.createWriteStream(zipFile);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    outputZip.on('close', () => {
      console.log(chalk.green(`Zip: ${zipFile}`));
      console.log(chalk.green(`${Math.round(archive.pointer() / 1024)} total kb`));
      console.log(chalk.green('Archiver has been finalized and the output file descriptor has closed.'));
      resolve();
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
    archive.directory(outputPath, false);
    archive.finalize();
  });
}

/**
 * 检查配置是否正确
 * @param {Object} data 数据
 * @return {Boolean}
 */
function checkSetting(data) {
  const rules = [{
    name: 'uid',
    type: 'String'
  }, {
    name: 'name',
    type: 'String'
  }, {
    name: 'descriptor',
    type: 'String'
  }, {
    name: 'login',
    type: 'Boolean'
  }, {
    name: 'version',
    type: 'String'
  }, {
    name: 'md5',
    type: 'String'
  }, {
    name: 'zip',
    type: 'String'
  }, {
    name: 'patch',
    type: 'String'
  }, {
    name: 'entry',
    type: 'String'
  }];
  const err = [];

  rules.forEach((r) => {
    const current = data[r.name];

    if (util.getType(current) !== r.type) {
      err.push(`${r.name} type must be ${r.type}`);
    }
  });

  if (err.length > 0) {
    throw new Error(err.join('\n'));
  }
  return !err.length;
}

/**
 * 转换为xml配置需要的格式
 * @param {Object} data 数据
 * @return {Object}
 */
function transformXMLData(data) {
  const result = {};
  const resPackage = [];

  for (const k in data.package) {
    resPackage.push({
      [k]: data.package[k]
    });
  }
  result.package = resPackage;
  return result;
}

/**
 * 获取没有修改的文件
 * @param {Object} newFiles 新文件列表
 * @param {Object} oldFiles 旧文件列表
 * @return {String[]}
 */
function getNotModifiedFiles(newFiles, oldFiles) {
  if (!util.isObject(newFiles) || !util.isObject(oldFiles)) {
    throw new Error('manifest format error.');
  }

  const notModified = [];
  const newArrFiles = Object.keys(newFiles);

  newArrFiles.forEach((file) => {
    if (newFiles[file] === oldFiles[file]) {
      notModified.push(newFiles[file]);
    }
  });

  return notModified;
}

/**
 * 删除文件
 * @param {String} realPath 真实路径
 * @param {String} publicPath 公共路径，跟webpack publicPath一致
 * @param {String[]} files 文件路径
 */
function removeFiles(realPath, publicPath, files) {
  files.forEach((f) => {
    fse.removeSync(path.join(realPath, f.replace(publicPath, '')));
  });
}

/**
 * 解析sinclude
 * @param {Object} ssi SSI对象
 * @param {String} filePath 文件路径
 * @return {Promise}
 */
function compileFile(ssi, filePath) {
  return new Promise((resolve, reject) => {
    ssi.compileFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT' && err.path === filePath) {
          return reject(err);
        }

        return reject(err);
      }

      resolve(content);
    });
  });
}

module.exports = {
  createZip,
  checkSetting,
  transformXMLData,
  getNotModifiedFiles,
  removeFiles,
  compileFile
};
