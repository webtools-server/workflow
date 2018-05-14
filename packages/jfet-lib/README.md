# jfet-lib

公共库命令插件，支持语法校验，构建，单元测试

## 文档

- 快速开始，`doc/QuickStart.md`

## 功能

- 功能1
- 功能2

## 安装

需要全局安装，如果已经安装过，可以跳过

```shell
npm i @jyb/jfet -g
npm i @jyb/jfet-lib -g
```

## 使用

```shell

```

## 配置文件

```javascript
module.exports = {
  lib(abc, context) {
    // build
    context.setConfig('build', {
      rollup: {},
      plugin: {},
      output: {},
      watch: {}
    });

    // test
    context.setConfig('test', {
      karma: {},
      coverage: false
    });

    // event
    const buildCtx = context.getContext('build');
    const testCtx = context.getContext('test');

    buildCtx.on('before-watch', () => {});
    buildCtx.on('after-watch', () => {});
    buildCtx.on('before-build', () => {});
    buildCtx.on('after-build', () => {});

    testCtx.on('before-test', () => {});
    testCtx.on('after-test', () => {});
  }
};
```
