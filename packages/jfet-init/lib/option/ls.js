/**
 * ls
 */

const utilLog = require('../util/log');
const getGroupsData = require('../common/get_groups_data');

const optionLS = {};

optionLS.run = () => {
    getGroupsData().then((res) => {
        const projects = JSON.parse(res);

        utilLog.info(`仓库有${projects.length}个模板\r\n`);
        for (let i = 0, len = projects.length; i < len; i++) {
            utilLog.info(`${i + 1}：${projects[i].name} - ${projects[i].description}\r\n`);
        }
    }).catch((err) => {
        utilLog.error(err);
    });
};

module.exports = optionLS;
