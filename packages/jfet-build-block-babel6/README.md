# babel6构建功能块

支持[babel6](https://github.com/babel/babel-loader)

## 安装

```shell
npm i @jyb/jfet-build-block-babel6 --save
```

## 使用

更多用法见`jfet-build`的`开发构建功能块`[文档](http://git.jtjr.com/h5_webtools_grp/workflow/blob/master/packages/jfet-build/doc/DevelopBlock.md)

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