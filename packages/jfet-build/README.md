# jfet-build

构建命令插件

## 文档

- 核心API，`doc/CoreAPI.md`
- 开发构建功能块，`doc/DevelopBlock.md`
- 开发构建预插件，`doc/DevelopPlugin.md`
- 开发构建预置方案，`doc/DevelopPreset.md`

## 功能

- 内置构建方案jfet-build-preset-common
- 支持watch/build两种模式

## 安装

需要全局安装，如果已经安装过，可以跳过

因为涉及到`node-sass`的安装，可以修改`.npmrc`文件，增加下面内容：

```text
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

```shell
npm i @jyb/jfet -g
npm i @jyb/jfet-build -g
```

## 使用

```shell
jfet build // 启动构建，process.env.JFET_ENV为build
jfet build --watch/-w // 监听文件，process.env.JFET_ENV为watch

jfet build --version
jfet build --help
```

## 事件

```javascript
// before-emit 执行插件前
// after-emit 执行插件后
// before preset执行前，可以认为是webpack编译前
// after preset执行后，可以认为是webpack编译后
// created webpack配置生成后
// end 插件执行完成
// error 错误
```

## 配置文件

```javascript
module.exports = {
  build(abc, context) {
    // 环境 watch,build
    context.env
    // 构建方案
    context.preset
    // 构建方案配置
    context.configuration

    // 修改预置构建方案，支持传入string或者object
    context.setPreset('react');

    // 修改预置构建方案的配置
    context.setConfig({
        outputPath: '',
        publicPath: ''
    });

    // 添加构建功能块
    context.addBlock();

    // 构建前
    context.on('before', () => {});
    // 生成打包配置
    context.on('created', (packConfig) => {
      // packConfig为进行构建的webpack配置
    });
    // 构建后
    context.on('after', () => {});
    // 错误
    context.on('error', (e) => {});
  }
};
```
