/**
 * 生成项目
 */

const glob = require('glob');
const inquirer = require('inquirer');
const fse = require('fs-extra');
const path = require('path');
const exec = require('child_process').exec;
const utilLog = require('../util/log');
const config = require('../config');

function emptyStr() { return ''; }

/**
 * 生成模板
 * @param {String} templateName 模板名字
 * @param {String} cloneURL 项目地址
 * @param {String} outputPath 输出路径
 * @param {Boolean} isForce 是否清除输出路径
 */
function generate(templateName, cloneURL, outputPath, isForce) {
  const tempPath = path.join(__dirname, 'temp');
  const command = `git clone ${cloneURL} ${tempPath}`;

  outputPath = outputPath || process.cwd();

  // 清除临时目录
  fse.removeSync(tempPath);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return utilLog.error(stderr);
    }

    try {
      // 删除.git文件夹
      fse.removeSync(path.join(tempPath, '.git'));

      // 替换文本
      const templateConfig = fse.readJsonSync(path.join(tempPath, config.configFile));
      const questions = templateConfig.questions || [];
      const replaceFiles = glob.sync(path.join(tempPath, config.globSearchFiles));

      inquirer.prompt(questions).then((answers) => {
        replaceFiles.forEach((file) => {
          let content = fse.readFileSync(file, 'utf-8');

          // 根据用户输入的内容进行替换
          for (const k in answers) {
            const regex = new RegExp(`{{=${k}}}`, 'g');
            content = content.replace(regex, answers[k]);
          }

          // 替换全局定义的变量
          content = content.replace(/\{\{=global\.([^}]+)\}\}/g, (m, $1) => {
            return (config.globalVariable[$1] || emptyStr)();
          });

          fse.outputFileSync(file, content);
        });

        // 清空输出目录
        if (isForce) {
          fse.emptyDirSync(outputPath);
        }

        // 复制文件到命令执行目录
        fse.copySync(path.join(tempPath, config.templatePath), outputPath, {
          clobber: true,
          filter: (source) => {
            utilLog.info(source.replace(tempPath, ''));
            return true;
          }
        });

        // 清除临时目录
        fse.removeSync(tempPath);
        utilLog.info(`初始化"${templateName}"模板完成`);
      });
    } catch (e) {
      // 清除临时目录
      fse.removeSync(tempPath);
      utilLog.error(e);
    }
  });
}

module.exports = generate;
