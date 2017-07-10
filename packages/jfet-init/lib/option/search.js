/**
 * search
 */

const utilLog = require('../util/log');
const getGroupsData = require('../common/get_groups_data');

const optionSearch = {};

optionSearch.run = (opts) => {
    getGroupsData().then((res) => {
        const template = opts.template;
        const projects = JSON.parse(res);
        let index = 0;

        for (let i = 0, len = projects.length; i < len; i++) {
            const currTemplateName = projects[i].name;

            if (currTemplateName.indexOf(template) > -1) {
                utilLog.info(`${++index}：${currTemplateName} - ${projects[i].description}\r\n`);
            }
        }

        utilLog.info(`仓库找到${index}个与"${template}"相关的模板\r\n`);
    }).catch((err) => {
        utilLog.error(err);
    });
};

module.exports = optionSearch;
