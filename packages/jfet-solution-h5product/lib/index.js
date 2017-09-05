/**
 * config
 */

const path = require('path');
const fse = require('fs-extra');
const util = require('./utils/util');

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
      fse.emptyDirSync(currentPublic);
    });

    // 构建后
    context.on('after', () => {
      if (isBuildEnv && buildEnv !== 'pack') {
        if (abc.useShtml) {
          util.copyShtml(currentPublic);
        }

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
        baseDir: path.join(cwd, '..', '..'),
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
  pack(abc, context) {
    context.setConfig({
      root: path.join(cwd, 'public'), // 打包的文件根目录
      ssiPattern: 'pages/*.html', // 相对root
      ssi: { // ssi配置
        baseDir: path.join(cwd, '..', '..') // sinclude目录
      },
      fullLink: { // 用于增加//形式加载资源的协议头部
        pattern: '**/*.{js,css,html}', // 相对root
        protocol: 'https' // 替换的协议
      },
      outputPath: abc.outputPath || '', // 输出路径，指的是压缩包内路径
      releasePath: path.join(cwd, abc.releasePath), // 发布路径
      publicPath: abc.publicPath || '../', // 跟webpack publicPath一致
      manifest: {
        filepath: path.join(cwd, 'public'), // manifest路径
        name: 'manifest.json' // manifest文件名字
      },
      zipUrl: abc.zipUrl || '', // 包地址前缀，例如：http://example.com
      app: Object.assign({ // 应用设置
        uid: '', // 业务包UID，该ID需要用于app跳转链接的入口配置
        entry: '', // 业务包入口
        name: '', // 业务包名称
        desc: '', // 业务包介绍
        login: false, // 是否需要登录
      }, abc.app)
    });
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
