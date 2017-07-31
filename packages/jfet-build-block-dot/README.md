# doT模板构建功能块

支持[doT.js模板引擎](http://olado.github.io/doT/index.html)

## 安装

```shell
npm i @jyb/jfet-build-block-dot --save
```

## 使用

更多用法见`jfet-build`的`开发构建功能块`[文档](http://git.jtjr.com/h5_webtools_grp/workflow/blob/master/packages/jfet-build/doc/DevelopBlock.md)

```javascript
const dot = require('@jyb/jfet-build-block-dot');

// preset
createConfig(context, [
  dot({
    htmlResourceRoot: '',
    dotSettings: {}
  })
]);
```

## 选项

可以访问[doT.js文档templateSettings](http://olado.github.io/doT/index.html)