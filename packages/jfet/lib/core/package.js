/**
 * npm包管理
 */

const execSync = require('child_process').execSync;
const chalk = require('chalk');
const urllib = require('urllib');
const util = require('../util');
const pkgJson = require('../../package.json');
const {
  TOOL_PREFIX,
  COMMAND_PREFIX,
  SOLUTION_PREFIX,
  NPM_SEARCH_API
} = require('../constant');

const TOOL_REGEX = new RegExp(`^(${TOOL_PREFIX.join('|')})$`);
const COMMAND_REGEX = new RegExp(`^(${COMMAND_PREFIX.join('|')})[a-z0-9]+$`);
const SOLUTION_REGEX = new RegExp(`^(${SOLUTION_PREFIX.join('|')})[a-z0-9]+$`);

function npmPackage() {
  const packages = {
    tool: [],
    command: [],
    solution: []
  };

  return urllib.request(NPM_SEARCH_API)
    .then((result) => { // 获取npm包数据
      if (result.status !== 200) {
        throw new Error(result.status);
      }

      try {
        return JSON.parse(result.data.toString('utf-8'));
      } catch (e) {
        throw new Error(e);
      }
    })
    .then((result) => { // tool
      packages.tool = result.filter(res => TOOL_REGEX.test(res.name));
      return result;
    })
    .then((result) => { // command包
      packages.command = result.filter(res => COMMAND_REGEX.test(res.name));
      return result;
    })
    .then((result) => { // solution包
      packages.solution = result.filter(res => SOLUTION_REGEX.test(res.name));
      return result;
    })
    .then(() => { // 获取本地已经安装的command和solution
      return [].concat(
        packages.tool,
        packages.command,
        packages.solution
      ).reduce((pkgArr, pkg) => {
        let packageEntry = null;

        // 如果是工具核心
        if (TOOL_PREFIX.indexOf(pkg.name) > -1) {
          pkgArr.push({
            name: pkg.name,
            latestVersion: pkg.version,
            oldVersion: pkgJson.version
          });
        } else {
          packageEntry = util.loadPackage(pkg.name, false);
          if (packageEntry) {
            pkgArr.push({
              name: pkg.name,
              latestVersion: pkg.version,
              oldVersion: packageEntry.version
            });
          }
        }

        return pkgArr;
      }, []);
    })
    .then((pkgArr) => { // 获取有更新的command和solution
      return pkgArr.filter(pkg => pkg.latestVersion !== pkg.oldVersion);
    })
    .then((pkgArr) => { // 更新
      if (pkgArr.length) {
        const info = [];
        const updatePkg = [];

        console.log(chalk.green('正在更新：'));
        pkgArr.forEach((pkg) => {
          updatePkg.push(pkg.name);
          info.push(`${pkg.name}: latestVersion: ${pkg.latestVersion}, oldVersion: ${pkg.oldVersion}`);
        });
        console.log(chalk.green(info.join('\n')));
        execSync(`npm i -g ${updatePkg.join(' ')}`);
      } else {
        console.log(chalk.green('没有找到需要更新的模块'));
      }
    });
}

module.exports = npmPackage;
