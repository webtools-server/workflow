# assemble构建功能块

支持[assemble](https://github.com/assemble/assemble/)

## 安装

```shell
npm i @jyb/jfet-build-block-assemble --save
```

## 使用

更多用法见`jfet-build`的`开发构建功能块`[文档](http://git.jtjr.com/h5_webtools_grp/workflow/blob/master/packages/jfet-build/doc/DevelopBlock.md)

```javascript
const assemble = require('@jyb/jfet-build-block-assemble');

// jfet.config.js
module.exports = {
  build(context) {
    context.addBlock(assemble(options));
  }
}
```

## 内置helper

- `require`，用于处理静态资源路径
- `manifest`，输出静态资源信息
- `inline`，内嵌资源

## 选项

### layouts
- Type: `String`
- Default: ''

layouts路径

```javascript
{
  layouts: path.join(process.cwd(), 'development/act_914/pages/layout/*.hbs')
}
```

### partials
- Type: `String`
- Default: ''

partials路径

```javascript
{
  partials: path.join(process.cwd(), 'development/act_914/pages/partials/*.hbs')
}
```

### pages
- Type: `String`
- Default: ''

pages路径

```javascript
{
  pages: path.join(process.cwd(), 'development/act_914/pages/**/index.hbs')
}
```

### helper
- Type: `Object`
- Default: {}

helper，默认支持`require`，用于处理静态资源路径

### injectData
- Type: `Object`
- Default: {}

注入的数据

### mapPath
- Type: `String`
- Default: ''

静态资源映射表路径

```javascript
{
  mapPath: path.join(cwd, 'development/act_914/public/mainfest.json'),
}
```

### assembleApp
- Type: `Function`
- Default: function(app) {}

assemble实例处理函数，可以自由操作

```javascript
{
  assembleApp(app) {
    app.helper('moment', moment);
  }
}
```

### renameFunc
- Type: `Function`
- Default: null

重命名处理函数，可以修改输出路径，以及输出文件名字

```javascript
{
  renameFunc(file) {
    // file为文件的路径
    const arrPath = path.dirname(file.key).split(path.sep);
    const outputPath = path.join(process.cwd(), 'development/act_914/public');

    file.dirname = outputPath;
    file.filename = arrPath.pop();
    file.extname = '.html';
    return outputPath;
  }
}
```
