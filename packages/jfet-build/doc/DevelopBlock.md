# 开发构建功能块

每一个功能块应该为高阶函数，例如

```javascript
function blockDemo(options = {}) {
  /**
   * @param {Object} context 上下文
   * @param {Object} context.match match到的loader配置，一般用于match内的功能块才用到
   * @param {Object} context.webpack webpack对象
   * @param {Object} context.webpackVersion webpack版本，返回例子：{major: 1, minor: 0, patch: 1, prerelease: 'beta', raw: '1.0.1-beta'}
   * @param {Object} util 工具方法，源码位置：lib/core/util.js
   * @param {Function} util.merge 配置合并
   * @param {Function} util.addLoader 添加loader
   * @param {Function} util.addPlugin 添加插件
   * @param {Function} util.scan 查找入口
   */
  return (context, util) => {
    return util.merge({
      resolve: {
        alias: {}
      }
    });
  };
}
```

## 执行过程

每一个功能块都会经过3个过程，预处理（pre）-> 处理中（config）-> 后处理（post）

```javascript
function blockDemo(options = {}) {
  const setter = context => (prevConfig) => {
    return prevConfig;
  };

  return Object.assign(setter, {
    pre(context) {}
    post(context, util) {
      return util.addLoader(config);
    }
  });
}
```

## 开发

```javascript
/**
 * @param {object} [options]
 * @return {Function}
 */
function dot(options = {}) {
  return (context, util) => util.addLoader(
    Object.assign({
      test: /\.dot$/,
      use: [{
        loader: require.resolve('./loader/dot'),
        options
      }]
    }, context.match)
  );
}

module.exports = dot;
```

## 使用

在构建预设方案中使用

```javascript
const { createConfig } = require('jyb_jfet-build-block-webpack3');
const dot = require('./lib');

module.exports = {
  run(core, context) {
    const packConfig = createConfig(context, [
      dot()
    ]);
  }
};
```

在jfet.config.js中的build函数中使用

```javascript
const dot = require('./lib');

module.exports = {
  build(abc, context) {
    // 添加构建功能块
    context.addBlock(dot());
  }
};
```