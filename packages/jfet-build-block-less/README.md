# less构建功能块

支持[less-loader](https://github.com/webpack-contrib/less-loader)

## 安装

```shell
npm i @jyb/jfet-build-block-less --save
```

## 使用

```javascript
const less = require('@jyb/jfet-build-block-less');

// preset
createConfig(context, [
    less(options)
]);
```