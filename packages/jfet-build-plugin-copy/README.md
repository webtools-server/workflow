# 构建发布复制插件

支持复制发布文件到对应目录

## 安装

```shell
npm i @jyb/jfet-build-plugin-copy --save
```

## 使用

```javascript
const copyPlugin = require('@jyb/jfet-build-plugin-copy');

this.usePlugin(copyPlugin({
  copy: [{ // 单独复制
    from: '',
    to: ''
  }],
  isRelease: true, // 默认为false，是否从copyFrom复制到copyTo
  copyFrom: path.join(cwd, 'public'),
  copyTo: path.join(cwd, 'release')
}));
```

