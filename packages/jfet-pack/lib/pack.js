/**
 * pack
 */

const SSI = require('node-ssi');
const path = require('path');
const co = require('co');
const md5 = require('md5');
const fse = require('fs-extra');
const chalk = require('chalk');
const glob = require('glob');
const urlRegex = require('url-regex');
const xml = require('xml');
const archiver = require('archiver');
const extend = require('extend');
const urlModule = require('url');
const inquirer = require('inquirer');
const util = require('./util');

const cwd = process.cwd();
const defaultOptions = {
  root: path.join(cwd, 'public'), // 打包的文件根目录
  ssiPattern: 'pages/*.html', // 相对root
  ssi: { // ssi配置
    baseDir: cwd // sinclude目录
  },
  fullLink: { // 用于增加//形式加载资源的协议头部
    pattern: '**/*.{js,css,html}', // 相对root
    protocol: 'https' // 替换的协议
  },
  outputPath: '', // 输出路径，指的是压缩包内路径
  releasePath: path.join(cwd, 'h5zip'), // 发布路径
  publicPath: '../', // 跟webpack publicPath一致
  manifest: {
    filepath: path.join(cwd, 'public'), // manifest路径
    name: 'manifest.json' // manifest文件名字
  },
  zipUrl: '', // 包地址前缀，例如：http://example.com
  app: { // 应用设置
    uid: '', // 业务包UID，该ID需要用于app跳转链接的入口配置
    entry: '', // 业务包入口
    name: '', // 业务包名称
    desc: '', // 业务包介绍
    login: false, // 是否需要登录
  }
};

class Pack {
  constructor(argv) {
    this.configuration = Object.assign({}, argv);
  }

  /**
   * 设置配置
   * @param {Object} cfg
   */
  setConfig(cfg) {
    if (!util.isObject(cfg)) {
      throw new Error('Config must be object.');
    }

    extend(true, this.configuration, defaultOptions, cfg);
  }

  /**
   * 启动
   */
  start() {
    const that = this;
    let rootPath = this.configuration.root;
    const ssiOptions = this.configuration.ssi;
    const appInfo = this.configuration.app;
    const {
      ssiPattern,
      fullLink,
      outputPath,
      releasePath,
      publicPath,
      manifest,
      zipUrl
    } = this.configuration;
    const uid = String(appInfo.uid) || '';

    if (!rootPath) {
      return console.log(chalk.red('File path is required.'));
    }

    if (!path.isAbsolute(rootPath)) {
      rootPath = path.join(cwd, rootPath);
    }

    const tempPath = path.join(__dirname, `pack${Date.now()}`);
    co(function* () {
      try {
        // 版本号设置
        const pkgFile = path.join(cwd, 'package.json');
        const pkg = util.tryRequire(pkgFile);

        if (!pkg) {
          throw new Error('Please add package.json file in current path.');
        }

        const versionFormat = yield that.versionPrompt(pkg.version);
        const realPath = path.join(tempPath, uid, outputPath);
        const ssi = new SSI(Object.assign({
          baseDir: '.',
          ext: '.html'
        }, ssiOptions));

        // 复制文件到realPath
        fse.copySync(rootPath, realPath);
        console.log(chalk.green(`Copy files from "${rootPath}"`));

        // 解析sinclude的路径
        const ssiFiles = glob.sync(path.join(realPath, ssiPattern), { nodir: true });

        if (Array.isArray(ssiFiles)) {
          for (let i = 0, l = ssiFiles.length; i < l; i++) {
            const currentSSIFile = ssiFiles[i];
            fse.outputFileSync(currentSSIFile, yield that.compileFile(ssi, currentSSIFile));
            console.log(chalk.green(`Parse sinclude the path from "${currentSSIFile}"`));
          }
        }

        // 增加fullLink
        glob.sync(
          path.join(realPath, fullLink.pattern), { nodir: true }
        ).forEach((sfs) => {
          let content = fse.readFileSync(sfs, 'utf-8');
          const urlMatch = content.match(urlRegex());

          if (Array.isArray(urlMatch)) {
            util.uniqueArray(
              urlMatch.filter(m => /^\/\//.test(m)).map(m => urlModule.parse(m).pathname)
            ).forEach((m) => {
              content = content.replace(new RegExp(m, 'g'), `${fullLink.protocol}:${m}`);
              console.log(chalk.green(`Add protocol "${m}" from "${sfs}"`));
            });
            fse.outputFileSync(sfs, content);
          }
        });

        // 打包
        const releaseZipPath = path.join(releasePath, uid);
        const newManifest = util.tryRequire(path.join(manifest.filepath, manifest.name));
        const oldManifest = util.tryRequire(path.join(releaseZipPath, manifest.name));
        let releaseZipFile = path.join(releaseZipPath, `${uid}.zip`);

        fse.ensureDirSync(releaseZipPath);
        if (!newManifest) {
          throw new Error(`${manifest.name} not found`);
        }

        // 增量包
        if (oldManifest) {
          releaseZipFile = path.join(releaseZipPath, `${uid}_patch.zip`);
          that.removeFiles(realPath, publicPath, that.getNotModifiedFiles(newManifest, oldManifest));
          console.log(chalk.green('Pack incremental package'));
        } else {
          // 只有第一次全量包的时候才生成manifest文件到发布目录
          fse.outputFileSync(path.join(releaseZipPath, manifest.name), JSON.stringify(newManifest, null, 2));
          console.log(chalk.green('Output manifest file'));
        }

        // 生成zip包
        yield that.createZip(releaseZipFile, tempPath);

        // 生成xml文件
        const settings = {
          package: {
            uid,
            name: appInfo.name,
            descriptor: appInfo.desc,
            login: appInfo.login,
            version: versionFormat,
            md5: md5(fse.readFileSync(releaseZipFile)),
            zip: `${zipUrl}/${uid}/${uid}.zip`,
            patch: `${zipUrl}/${uid}/${uid}_patch.zip`,
            entry: appInfo.entry
          }
        };
        if (that.checkSetting(settings.package)) {
          const xmlFile = path.join(releasePath, `${uid}.xml`);
          fse.outputFileSync(
            xmlFile,
            xml([that.transformXMLData(settings)], { declaration: true, indent: '  ' })
          );
          console.log(chalk.green(`Create xml file, ${xmlFile}`));
        }

        // 删除temp目录
        fse.removeSync(tempPath);
        // 设置下当前目录的package.json的版本
        pkg.version = versionFormat;
        fse.outputFileSync(pkgFile, JSON.stringify(pkg, null, 2));
        console.log(chalk.green('Pack success'));
      } catch (e) {
        console.log(chalk.red(e));
        fse.removeSync(tempPath);
      }
    });
  }

  /**
   * 创建zip
   * @param {String} zipFile zip文件
   * @param {String} outputPath 输出路径
   * @return {Promise}
   */
  createZip(zipFile, outputPath) {
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
   * 输入版本
   */
  versionPrompt(currentVersion) {
    return new Promise((resolve) => {
      inquirer.prompt([{
        type: 'input',
        name: 'version',
        message: `请输入版本号（当前版本:${currentVersion}）：`
      }]).then((answers) => {
        resolve(answers.version || currentVersion || '1.0.0');
      });
    });
  }

  /**
   * 检查配置是否正确
   * @param {Object} data 数据
   * @return {Boolean}
   */
  checkSetting(data) {
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
  transformXMLData(data) {
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
  getNotModifiedFiles(newFiles, oldFiles) {
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
  removeFiles(realPath, publicPath, files) {
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
  compileFile(ssi, filePath) {
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
}

module.exports = Pack;
