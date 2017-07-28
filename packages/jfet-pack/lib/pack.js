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
const extend = require('extend');
const urlModule = require('url');
const util = require('./util');
const helper = require('./helper');
const defaultOptions = require('./options');

const cwd = process.cwd();

class Pack {
  constructor(argv) {
    this.argv = argv;
    this.configuration = {};
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
    const appInfo = this.configuration.app;
    const {
      outputPath,
      releasePath,
      publicPath,
      manifest
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
        const xmlFile = path.join(releasePath, `${uid}.xml`);
        // 获取版本号
        const versionFormat = that.getVersion(xmlFile);

        // 真实路径，离线包内容要求在名称为uid的目录下
        const realPath = path.join(tempPath, uid, outputPath);

        // 复制文件到realPath
        fse.copySync(rootPath, realPath);
        console.log(chalk.green(`Copy files from "${rootPath}"`));

        // 解析sinclude的路径
        yield that.parseSinclude(realPath);

        // 增加fullLink
        that.replaceFullLink(realPath);

        // 打包
        let useFull = that.argv.full;
        const releaseZipPath = path.join(releasePath, uid);
        const newManifest = util.tryRequire(path.join(manifest.filepath, manifest.name));
        const oldManifest = util.tryRequire(path.join(releaseZipPath, manifest.name));
        const releaseFullZipFile = path.join(releaseZipPath, `${uid}.zip`);
        const releaseIncrementalZipFile = path.join(releaseZipPath, `${uid}_patch.zip`);

        fse.ensureDirSync(releaseZipPath);
        if (!newManifest) {
          throw new Error(`${manifest.name} not found`);
        }

        // 生成全量包
        yield helper.createZip(releaseFullZipFile, tempPath);
        console.log(chalk.green('Pack full package'));

        // 判断是否生成增量包
        if (oldManifest) {
          // 如果增量包的大小 > 全量包的大小，应该使用全量包
          if (util.getFileSize(releaseIncrementalZipFile) > util.getFileSize(releaseFullZipFile)) {
            useFull = true;
          }

          if (!useFull) {
            helper.removeFiles(realPath, publicPath, helper.getNotModifiedFiles(newManifest, oldManifest));
          }
        }
        yield helper.createZip(releaseIncrementalZipFile, tempPath);
        console.log(chalk.green('Pack incremental package'));

        // 这个版本，是否使用全量包
        useFull = useFull || !oldManifest;
        if (useFull) {
          fse.outputFileSync(path.join(releaseZipPath, manifest.name), JSON.stringify(newManifest, null, 2));
          console.log(chalk.yellow('This version will use full package'));
          console.log(chalk.yellow('Output manifest file'));
        }

        // 生成xml文件
        that.createXMLFile(xmlFile, versionFormat, uid, appInfo, releaseFullZipFile);

        // 删除temp目录
        fse.removeSync(tempPath);
        console.log(chalk.green('Pack success'));
      } catch (e) {
        console.log(chalk.red(e));
        fse.removeSync(tempPath);
      }
    });
  }

  /**
   * 获取版本
   * @param {String} xmlFile xml文件
   * @return {String}
   */
  getVersion(xmlFile) {
    const pkgFile = path.join(cwd, 'package.json');
    const pkg = util.tryRequire(pkgFile);
    let versionFormat = '';

    // 当前目录没有package.json
    if (!pkg) {
      throw new Error('Please add package.json file in current path');
    }

    // package.json没有设置version
    versionFormat = pkg.version;
    if (!versionFormat) {
      throw new Error('Please add version in package.json');
    }

    // 跟前一个版本号判断是否一致，如果一致需要先修改
    if (util.fileExists(xmlFile)) {
      const xmlContent = fse.readFileSync(xmlFile, 'utf-8');
      const xmlMatch = xmlContent.match(/<version>(.*)<\/version>/);
      if (xmlMatch && versionFormat === xmlMatch[1]) {
        throw new Error(`Please modify the version, current version is ${versionFormat}`);
      }
    }

    return versionFormat;
  }

  /**
   * 解析sinclude
   * @param {String} realPath
   * @return {Promise[]}
   */
  parseSinclude(realPath) {
    const { ssi, ssiPattern } = this.configuration;
    const ssiObj = new SSI(Object.assign({
      baseDir: '.',
      ext: '.html'
    }, ssi));

    return glob.sync(path.join(realPath, ssiPattern), { nodir: true }).map((sfile) => {
      return new Promise((resolve, reject) => {
        helper.compileFile(ssiObj, sfile).then((content) => {
          fse.outputFileSync(sfile, content);
          console.log(chalk.green(`Parse sinclude the path from "${sfile}"`));
          resolve();
        }).catch((err) => {
          reject(err);
        });
      });
    });
  }

  /**
   * 增加fullLink
   * @param {String} realPath 
   */
  replaceFullLink(realPath) {
    const { fullLink } = this.configuration;

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
  }

  createXMLFile(xmlFile, versionFormat, uid, appInfo, zipFile) {
    const { zipUrl } = this.configuration;
    const settings = {
      package: {
        uid,
        name: appInfo.name,
        descriptor: appInfo.desc,
        login: appInfo.login,
        version: versionFormat,
        md5: md5(fse.readFileSync(zipFile)),
        zip: `${zipUrl}/${uid}/${uid}.zip`,
        patch: `${zipUrl}/${uid}/${uid}_patch.zip`,
        entry: appInfo.entry
      }
    };
    if (helper.checkSetting(settings.package)) {
      fse.outputFileSync(
        xmlFile,
        xml([helper.transformXMLData(settings)], { declaration: true, indent: '  ' })
      );
      console.log(chalk.green(`Create xml file, ${xmlFile}`));
    }
  }
}

module.exports = Pack;
