# 开发构建插件

每一个插件应该为高阶函数，例如

```javascript
module.exports = function presetPlugin(options) {
  const defaultOptions = {
    preset: 'common'
  };
  const opts = Object.assign({}, defaultOptions, options);

  return function(next) {
    this.on('after', () => {});
    // 执行下一个插件
    next();
  };
};
```

## 使用

在jfet.config.js中的build函数中使用

```javascript
module.exports = {
  build(abc, context) {
    context.usePlugin(presetPlugin({ preset: 'common' }));
  }
};
```

