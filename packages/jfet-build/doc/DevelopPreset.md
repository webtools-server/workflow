# 开发构建预置方案

每一个预置方案必须暴露`run函数`，`run函数`必须返回`Promise`

## 开发

新增`jfet-build-preset-demo`

```javascript
const {
  createConfig,
  webpackCore,
  commonDoneHandler
} = require('jyb_jfet-build-block-webpack3');
const dot = require('jyb_jfet-build-block-dot');

module.exports = {
  /**
   * 入口，必须有
   * @param {Object} core 核心方法，源码位置：lib/core/index.js
   * @param {Function} core.createConfig 创建配置
   * @param {Function} core.group
   * @param {Function} core.env
   * @param {Function} core.match
   * @param {Object} context build对象，源码位置：lib/context.js
   */
  run(core, context) {
    return new Promise((resolve) => {
      const compiler = webpackCore(createConfig(context, [
        dot()
      ]));
      const done = commonDoneHandler.bind(null, !isProduction, resolve);

      if (!isProduction) {
        compiler.watch(200, done);
      } else {
        compiler.run(done);
      }
    });
  }
};
```

## 使用

jfet-build默认构建方案为：`jfet-build-preset-common`

在`jfet.config.js`中修改：

```javascript
// 安装在当前项目才需要引入
const presetDemo = require('jyb_jfet-build-preset-demo');

module.exports = {
  build(abc, context) {
    // 1. 如果jfet-build-preset-demo安装在全局
    // context.setPreset('demo');
    // 2. 如果安装在当前项目
    context.setPreset(presetDemo);
  }
};
```