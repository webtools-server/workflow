/**
 * ls
 */

const inquirer = require('inquirer');
const utilLog = require('../util/log');
const getGroupsData = require('../common/get_groups_data');
const generate = require('../common/generate');
const config = require('../config');

const optionLS = {};

/**
 * 选择创建项目
 * @param {Object} opts
 * @param {String} output 输出路径
 * @param {Boolean} force 是否先清空输出路径
 */
optionLS.run = (opts) => {
  const { output, force } = opts;

  getGroupsData().then((res) => {
    const projects = res.projects || [];
    const repoMap = {};
    const choices = [];

    for (let i = 0, len = projects.length; i < len; i++) {
      const curr = projects[i];
      const name = curr.name;

      if (name.indexOf(config.templatePrefix) > -1) {
        repoMap[name] = curr.http_url_to_repo;
        choices.push({
          name: `${i + 1}：${name} - ${curr.description}`,
          value: name
        });
      }
    }

    inquirer.prompt([{
      type: 'list',
      name: 'template',
      message: '请选择初始化的项目模板?',
      choices
    }]).then((answers) => {
      const template = answers.template;
      generate(template, repoMap[template], output, force);
    });
  }).catch((err) => {
    utilLog.error(err);
  });
};

module.exports = optionLS;
