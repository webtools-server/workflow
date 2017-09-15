/**
 * npm包管理
 */

const exec = require('child_process').exec;
const chalk = require('chalk');
const ora = require('ora');
const urllib = require('urllib');
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
        try {
          /* eslint-disable import/no-dynamic-require */
          const packageEntry = require(`${pkg.name}/package.json`);

          if (packageEntry) {
            pkgArr.push({
              name: pkg.name,
              latestVersion: pkg.version,
              oldVersion: packageEntry.version
            });
          }
        } catch (e) {
          /* eslint-disable no-empty */
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

        pkgArr.forEach((pkg) => {
          updatePkg.push(pkg.name);
          info.push(`${pkg.name}: latestVersion: ${pkg.latestVersion}, oldVersion: ${pkg.oldVersion}`);
        });
        console.log(chalk.green(info.join('\n')));

        const spinner = ora('正在更新...').start();
        exec(`npm i -g ${updatePkg.join(' ')}`, (error, stdout) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.log(stdout);
          spinner.stop();
        });
      } else {
        console.log(chalk.green('没有找到需要更新的模块'));
      }
    });
}

module.exports = npmPackage;
