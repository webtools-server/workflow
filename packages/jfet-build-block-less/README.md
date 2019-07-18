# less构建功能块

支持[less-loader](https://github.com/webpack-contrib/less-loader)

## 安装

```shell
npm i jyb_jfet-build-block-less --save
```

## 使用

更多用法见`jfet-build`的`开发构建功能块`[文档](../jfet-build/doc/DevelopBlock.md)


```javascript
const less = require('jyb_jfet-build-block-less');

// preset
createConfig(context, [
  less(options)
]);
```
