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
const extend = require('extend');
const urlModule = require('url');
const util = require('./util');
const helper = require('./helper');
const defaultOptions = require('./options');

const cwd = process.cwd();

class Pack {
  constructor(argv) {
    this.argv = argv || {};
    this.configuration = {};
  }

  /**
   * 设置配置
   * @param {Object} cfg
   */
  setConfig(cfg) {
    if (!util.isObject(cfg)) {
      throw new Error('配置必须为Object类型');
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
      throw new Error('文件路径必填');
    }

    if (!path.isAbsolute(rootPath)) {
      rootPath = path.join(cwd, rootPath);
    }

    const tempPath = path.join(__dirname, `pack${Date.now()}`);
    co(function* () {
      try {
        // 真实路径，离线包内容要求在名称为uid的目录下
        const realPath = path.join(tempPath, uid, outputPath);
        // json文件
        const jsonFile = path.join(releasePath, `${uid}.json`);
        const jsonFileToPack = path.join(tempPath, uid, `${uid}.json`);
        // 获取版本号
        const versionFormat = that.getVersion(jsonFile);

        // 复制文件到realPath
        fse.copySync(rootPath, realPath);
        console.log(chalk.green(`从"${rootPath}"拷贝文件`));

        // 解析sinclude的路径
        yield that.parseSinclude(realPath);

        // 增加fullLink
        that.replaceFullLink(realPath);

        // json配置文件也放一份到压缩包里面，不过没有md5
        that.createJSONFile(jsonFileToPack, versionFormat, uid, appInfo);

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
        console.log(chalk.green('生成全量包'));

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
        console.log(chalk.green('生成增量包'));

        // 这个版本，是否使用全量包
        useFull = useFull || !oldManifest;
        if (useFull) {
          fse.outputFileSync(path.join(releaseZipPath, manifest.name), JSON.stringify(newManifest, null, 2));
          console.log(chalk.yellow('这个版本将使用全量包'));
          console.log(chalk.yellow('输出manifest文件'));
        }

        // 生成json配置文件
        that.createJSONFile(jsonFile, versionFormat, uid, appInfo, releaseFullZipFile, releaseIncrementalZipFile);

        // 删除temp目录
        fse.removeSync(tempPath);
        console.log(chalk.green('打包成功'));
      } catch (e) {
        fse.removeSync(tempPath);
        console.log(chalk.red(e));
      }
    });
  }

  /**
   * 获取版本
   * @param {String} jsonFile json文件
   * @return {String}
   */
  getVersion(jsonFile) {
    const pkgFile = path.join(cwd, 'package.json');
    const pkg = util.tryRequire(pkgFile);
    let versionFormat = '';

    // 当前目录没有package.json
    if (!pkg) {
      throw new Error('当前目录必须有package.json文件');
    }

    // package.json没有设置version
    versionFormat = pkg.version;
    if (!versionFormat) {
      throw new Error('package.json文件必须有version字段');
    }

    // 跟前一个版本号判断是否一致，如果一致需要先修改
    if (util.fileExists(jsonFile)) {
      const jsonContent = util.tryRequire(jsonFile);
      if (versionFormat === jsonContent.version) {
        throw new Error(`请修改版本号，当前版本号：${versionFormat}`);
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
          console.log(chalk.green(`解析sinclude："${sfile}"`));
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

  createJSONFile(jsonFile, versionFormat, uid, appInfo, zipFullFile, zipIncrementalFile) {
    const { zipUrl } = this.configuration;
    const settings = {
      uid,
      name: appInfo.name,
      version: versionFormat,
      description: appInfo.desc,
      login: appInfo.login,
      zip: `${zipUrl}/${uid}/${uid}.zip`,
      zipMD5: zipFullFile ? md5(fse.readFileSync(zipFullFile)) : '',
      patch: `${zipUrl}/${uid}/${uid}_patch.zip`,
      patchMD5: zipIncrementalFile ? md5(fse.readFileSync(zipIncrementalFile)) : '',
      entry: appInfo.entry
    };

    if (helper.checkSetting(settings)) {
      fse.outputFileSync(
        jsonFile,
        JSON.stringify(settings, null, 2)
      );
      console.log(chalk.green(`创建配置文件, ${jsonFile}`));
    }
  }
}

module.exports = Pack;
