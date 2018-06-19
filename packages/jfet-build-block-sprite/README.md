# sprite构建功能块

支持[webpack-spritesmith](https://github.com/mixtur/webpack-spritesmith)

## 安装

```shell
npm i @jyb/jfet-build-block-sprite --save
```

## 使用

更多用法见`jfet-build`的`开发构建功能块`[文档](../jfet-build/doc/DevelopBlock.md)


```javascript
const sprite = require('@jyb/jfet-build-block-sprite');

// preset
createConfig(context, [
  sprite(options)
]);
```
