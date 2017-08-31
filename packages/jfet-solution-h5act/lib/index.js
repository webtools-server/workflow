/**
 * config
 */

const path = require('path');
const fse = require('fs-extra');

const buildConfig = {
  default: require('./config/config.default'),
  mock: require('./config/config.mock'),
  local: require('./config/config.local'),
  test: require('./config/config.test'),
  prod: require('./config/config.prod'),
  pack: require('./config/config.pack')
};

const cwd = process.cwd();

module.exports = {
  build(abc, context) {
    const env = context.env;
    const isBuildEnv = env === 'build';
    const currentPublic = path.join(cwd, 'public');
    const buildEnv = process.env.BUILD_ENV;

    // 修改预置构建方案的配置
    context.setConfig(buildConfig[buildEnv || 'default'](abc));

    // 构建前
    context.on('before', () => {
      fse.removeSync(currentPublic);
    });

    // 构建后
    context.on('after', () => {
      if (isBuildEnv && buildEnv !== 'pack') {
        const releasePath = path.join(cwd, abc.releasePath);
        fse.removeSync(releasePath);
        fse.copySync(currentPublic, releasePath);
      }
    });
    context.on('error', (e) => {
      console.error(e);
    });
  },
  server(abc, context) {
    const proxy = context.proxy;
    const serverEnv = process.env.SERVER_ENV;

    context.setConfig({
      opnPath: abc.opnPath[serverEnv] || '',
      ssi: { // ssi
        baseDir: path.join(__dirname),
        ext: '.html'
      },
      livereload: { // livereload
        watch: path.join(cwd, abc.livereload.watch)
      }
    });

    // proxy
    abc.proxy.forEach((p) => {
      context.registerRouter(p.method, p.route, proxy(p.options));
    });
  },
  doc() {
    const summaryFile = path.join(__dirname, 'SUMMARY.md');
    const developmentDir = path.join(__dirname, 'development');
    const summaryContent = [];
    const dir = fse.readdirSync(developmentDir);

    summaryContent.push('# 目录');
    summaryContent.push('* [主页](/README.md)');

    dir.filter((d) => {
      try {
        return fse.statSync(path.join(developmentDir, d)).isDirectory();
      } catch (e) {
        return false;
      }
    }).forEach((d) => {
      const readmeFile = path.join(developmentDir, d, 'README.md');
      if (fse.pathExistsSync(readmeFile)) {
        const readmeContent = fse.readFileSync(readmeFile, 'utf-8');
        const match = readmeContent.match(/#\s*(.*)/);
        let actName = d;

        if (match) {
          actName = `${match[1]}(${d})`;
        }

        summaryContent.push(`* [${actName}](/development/${d}/README.md)`);
      }
    });

    fse.outputFileSync(summaryFile, summaryContent.join('\n'));

    return {
      name: 'h5-act', // 文档名
      token: '21232F297A57A5A743894A0E4A801FC3',
      uploadUrl: 'http://172.16.1.10:7001/api/upload'
    };
  }
};
