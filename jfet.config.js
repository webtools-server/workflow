/**
 * jfet配置
 */

const path = require('path');
const fs = require('fs');
const pkg = require('./package.json');

module.exports = {
  doc() {
    const summaryFile = path.join(__dirname, 'SUMMARY.md');
    const packagesPath = path.join(__dirname, 'packages');
    const summaryContent = [];
    const dir = fs.readdirSync(packagesPath);

    summaryContent.push('# 目录');
    summaryContent.push('* [主页](/README.md)');
    summaryContent.push('* [常见问题](/tips.md)');

    dir.filter((d) => {
      try {
        return fs.statSync(path.join(packagesPath, d)).isDirectory();
      } catch (e) {
        return false;
      }
    }).forEach((d) => {
      const docPath = path.join(packagesPath, d, 'doc');

      summaryContent.push(`* [${d}](/packages/${d}/README.md)`);
      if (existDir(docPath)) {
        fs.readdirSync(docPath)
          .filter(file => /\.md$/.test(file))
          .forEach((file) => {
            const content = fs.readFileSync(path.join(docPath, file), 'utf-8');
            const title = content.split(/[\r\n]/)[0].replace('#', '').trim();

            summaryContent.push(`  * [${title}](/packages/${d}/doc/${file})`);
          });
      }
    });

    try {
      fs.writeFileSync(summaryFile, summaryContent.join('\n'));
      console.log('Output summary file successfully');
    } catch (e) {
      throw new Error(e);
    }

    return {
      name: pkg.name,
      title: 'jfet API文档',
      desc: 'jfet各个模块的API文档，更详细的文档请查看jfet官方网站。',
      token: '21232F297A57A5A743894A0E4A801FC3',
      uploadUrl: 'http://doc.fe.jyb.com/api/upload'
    };
  }
};

function existDir(file) {
  try {
    return fs.statSync(file).isDirectory();
  } catch (e) {
    return false;
  }
}
