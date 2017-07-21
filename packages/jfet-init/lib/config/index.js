/**
 * 公用配置
 */

// gitlab group http://git.jtjr.com/api/v3/groups/noop
const gitlabGroup = 'http://git.jtjr.com/groups/noop';

// userAgent
const userAgent = 'jfet-init';

// 模板前缀
const templatePrefix = 'template-';

// 配置文件
const configFile = 'config.json';

// glob查找文件
const globSearchFiles = 'template/**/{package.json,README.md}';

// 模板目录
const templatePath = 'template';

// 配置问答
const questions = [{
    type: 'input',
    name: 'privateToken',
    message: '请输入你的Gitlab private token（访问http://git.jtjr.com/profile/account获取）：'
}];

module.exports = {
    gitlabGroup,
    userAgent,
    templatePrefix,
    configFile,
    templatePath,
    globSearchFiles,
    questions
};
