# babel6构建功能块

支持[babel6](https://github.com/babel/babel-loader)

## 安装

```shell
npm i @jyb/jfet-build-block-babel6 --save
```

## 使用

```javascript
const babel6 = require('@jyb/jfet-build-block-babel6');

// preset
createConfig(context, [
    babel6({
        babelrc: false,
        presets: [
            require.resolve('babel-preset-es2015'),
            require.resolve('babel-preset-stage-0'),
        ],
        cacheDirectory: true
    })
]);
```