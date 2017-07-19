# sass构建功能块

支持[sass-loader](https://github.com/webpack-contrib/sass-loader)

## 安装

```shell
npm i @jyb/jfet-build-block-sass --save
```

## 使用

```javascript
const sass = require('@jyb/jfet-build-block-sass');

// preset
createConfig(context, [
    sass(options)
]);
```