/**
 * default options
 */

const path = require('path');

const cwd = process.cwd();

module.exports = {
  root: path.join(cwd, 'public'), // 打包的文件根目录
  ssiPattern: 'pages/*.html', // 相对root
  ssi: { // ssi配置
    baseDir: cwd // sinclude目录
  },
  fullLink: { // 用于增加//形式加载资源的协议头部
    pattern: '**/*.{js,css,html}', // 相对root
    protocol: 'https' // 替换的协议
  },
  outputPath: '', // 输出路径，指的是压缩包内路径
  releasePath: path.join(cwd, 'h5zip'), // 发布路径
  publicPath: '../', // 跟webpack publicPath一致
  manifest: {
    filepath: path.join(cwd, 'public'), // manifest路径
    name: 'manifest.json' // manifest文件名字
  },
  zipUrl: '', // 包地址前缀，例如：http://example.com
  app: { // 应用设置
    uid: '', // 业务包UID，该ID需要用于app跳转链接的入口配置
    entry: '', // 业务包入口
    name: '', // 业务包名称
    desc: '', // 业务包介绍
    login: false, // 是否需要登录
  }
};
