/**
 * config
 */

const path = require('path');
const fse = require('fs-extra');

// plugin
const buildPluginFtp = require('@jyb/jfet-build-plugin-ftp');
const buildPluginCopy = require('@jyb/jfet-build-plugin-copy');

const abcJSON = require('./abc.json');

const buildConfig = {
  default: require('./config/config.default'),
  mock: require('./config/config.mock'),
  local: require('./config/config.local'),
  test: require('./config/config.test'),
  prod: require('./config/config.prod')
};

const cwd = process.cwd();

module.exports = {
  build(abc, context) {
    const env = context.env;
    const isBuildEnv = env === 'build';
    const buildEnv = process.env.BUILD_ENV;
    const buildAbcJSON = abcJSON.build;

    // 修改预置构建方案的配置
    context.setConfig(buildConfig[buildEnv || 'default'](abc));

    // 当设置了sftp字段的prod，才会上传sourcemap文件，并且会合并配置
    if (abc.sftp && abc.sftp[buildEnv]) {
      context.usePlugin(buildPluginFtp(Object.assign(buildAbcJSON.sftp, abc.sftp[buildEnv])));
    }
    context.usePlugin(buildPluginCopy({
      copy: abc.copy || [],
      isRelease: isBuildEnv && buildEnv !== 'pack',
      copyFrom: path.join(cwd, 'public'),
      copyTo: path.join(cwd, abc.releasePath)
    }));
  },
  server(abc, context) {
    const proxy = context.proxy;
    const serverEnv = process.env.SERVER_ENV;

    context.setConfig({
      port: abc.port,
      opnPath: abc.opnPath[serverEnv] || '',
      ssi: { // ssi
        baseDir: path.join(cwd, '..', '..'),
        ext: '.html'
      },
      livereload: { // livereload
        watch: path.join(cwd, abc.livereload.watch),
        init: abc.livereload.init || {}
      }
    });

    // proxy
    abc.proxy.forEach((p) => {
      context.registerRouter(p.method, p.route, proxy(p.options));
    });
  },
  doc(abc) {
    const summaryFile = path.join(cwd, 'SUMMARY.md');
    const developmentDir = path.join(cwd, 'development');
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
      name: abc.name, // 文档名
      token: abc.token,
      title: abc.title || '',
      desc: abc.desc || '',
      uploadUrl: abc.uploadUrl
    };
  },
  image(abc) {
    const minOptions = {
      input: [path.join(cwd, abc.input || 'public/image/*.{jpg,png,gif}')], // 输入
      output: path.join(cwd, abc.output || 'public/image'), // 输出目录
    };

    return {
      min: minOptions
    };
  }
};
