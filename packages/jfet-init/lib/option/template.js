/**
 * init
 */

const fse = require('fs-extra');
const path = require('path');
const exec = require('child_process').exec;
const utilLog = require('../util/log');
const getGroupsData = require('../common/get_groups_data');

const optionTemplate = {};

optionTemplate.run = (opts) => {
    getGroupsData().then((res) => {
        const template = opts.template;
        const projects = JSON.parse(res);
        let templateName = '';
        let cloneURL = '';

        for (let i = 0, len = projects.length; i < len; i++) {
            const currTemplateName = projects[i].name;

            if (currTemplateName === template) {
                templateName = currTemplateName;
                cloneURL = projects[i].clone_url;
                break;
            }
        }

        if (!templateName || !cloneURL) {
            utilLog.error(`仓库没有找到"${template}"模板`);
            return;
        }

        const outputPath = path.join(__dirname, 'temp');
        const command = `git clone ${cloneURL} ${outputPath}`;

        // 清除输出路径
        fse.removeSync(outputPath);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                utilLog.error(stderr);
                return;
            }

            // 删除.git文件夹
            fse.removeSync(path.join(outputPath, '.git'));

            // 复制文件到命令执行目录
            fse.copySync(outputPath, process.cwd(), {
                clobber: true,
                filter: (source) => {
                    utilLog.info(source.replace(outputPath, ''));
                    return true;
                }
            });

            // 清除输出路径
            fse.removeSync(outputPath);
            utilLog.info(`初始化"${templateName}"模板完成`);
        });
    }).catch((err) => {
        utilLog.error(err);
    });
};

module.exports = optionTemplate;
