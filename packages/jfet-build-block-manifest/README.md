# manifet构建功能块

生成静态资源表

## 安装

```shell
npm i @jyb/jfet-build-block-manifest --save
```

## 使用

更多用法见`jfet-build`的`开发构建功能块`[文档](http://git.jtjr.com/h5_webtools_grp/workflow/blob/master/packages/jfet-build/doc/DevelopBlock.md)

```javascript
const manifest = require('@jyb/jfet-build-block-manifest');

// jfet.config.js
module.exports = {
  build(context) {
    context.addBlock(manifest(options));
  }
}
```

## 选项

### assetsPath
- Type: `String`
- Default: ''

资源路径

### output
- Type: `String`
- Default: path.join(compiler.outputPath, 'manifest.json')

文件输出

### sep
- Type: `String`
- Default: '-'

md5和文件名分隔符

### include
- Type: `Array`
- Default: ['.js', '.css']

包含的文件类型

### appName
- Type: `String`
- Default: stats.publicPath

默认为output.publicPath

### cache
- Type: `Object`
- Default: {}

自定义内容，会跟生成的manifest合并