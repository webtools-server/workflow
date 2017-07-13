# jfet-build

构建命令插件

## 功能

- 构建

## 安装

需要全局安装，如果已经安装过，可以跳过

```shell
npm i @jyb/jfet -g
npm i @jyb/jfet-build -g
```

## 使用

```shell
jfet build --watch/-w

jfet build --version
jfet build --help
```

## 配置文件

```javascript
module.exports = {
    build(context) {
        // 环境 watch,build
        context.env
        // 构建方案
        context.preset
        context.configuration

        // 辅助功能
        context.helper.watch
        context.helper.fse
        context.core.webpack

        // 修改预置构建方案
        context.setPreset('react');

        // 修改预置构建方案的配置
        context.setConfig({
            outputPath: '',
            publicPath: ''
        });

        // 构建前
        context.on('before', () => {});
        // 生成打包配置
        context.on('created', (packConfig) => {});
        // 构建后
        context.on('after', () => {});
        context.on('error', (e) => {});
    }
};
```
