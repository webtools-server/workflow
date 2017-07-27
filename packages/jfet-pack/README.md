# jfet-pack

H5产品应用本地化打包命令插件

## 功能

- 支持本地化打包
- 生成xml配置文件

## 安装

需要全局安装，如果已经安装过，可以跳过

```shell
npm i @jyb/jfet -g
npm i @jyb/jfet-pack -g
```

## 使用

```shell
jfet pack
jfet pack --version
jfet pack --help
```

## 配置文件

```javascript
module.exports = {
  pack(abc, context) {
    context.setConfig({
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
    });
  }
};
```
