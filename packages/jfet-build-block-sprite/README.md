# sprite构建功能块

支持[webpack-spritesmith](https://github.com/mixtur/webpack-spritesmith)

## 安装

```shell
npm i @jyb/jfet-build-block-sprite --save
```

## 使用

```javascript
const sprite = require('@jyb/jfet-build-block-sprite');

// preset
createConfig(context, [
    sprite(options)
]);
```