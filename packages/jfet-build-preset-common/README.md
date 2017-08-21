# 通用构建方案

`build`默认使用的构建方案，支持：

- @jyb/jfet-build-block-assets
- @jyb/jfet-build-block-babel6
- @jyb/jfet-build-block-dot
- @jyb/jfet-build-block-less
- @jyb/jfet-build-block-webpack3
- @jyb/jfet-build-block-vue
- @jyb/jfet-build-block-assemble
- @jyb/jfet-build-block-sass

## 安装

```shell
npm i @jyb/jfet-build-preset-common --save
```

## 使用

```javascript
// jfet.config.js
module.exports = {
  build(context) {
    context.setPreset('common');
  }
};
```

## 配置

### manifestPlugin
- Type: `Object`
- Default:

```javascript
{
  assetsPath: '',
  output: path.join(compiler.outputPath, 'manifest.json'),
  sep: '-',
  include: ['.js', '.css'],
  appName: stats.publicPath,
  cache: {}
}
```

使用[jfet-build-block-manifest](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-manifest)

### uglifyJsPlugin
- Type: `Object`
- Default:

```javscript
{
  compress: {
    warnings: false
  },
  output: {
    comments: false
  },
  screwIe8: true,
  sourceMap: false
}
```

使用[webpack.optimize.UglifyJsPlugin](https://webpack.js.org/guides/production/#minification)

### commonsChunkPlugin
- Type: `Object|Array`
- Default:

```javscript
{
  name: 'vendor',
  filename: isProduction ? 'js/[name].[hash:8].js' : 'js/[name].js',
}
```

使用[commons-chunk-plugin](https://webpack.js.org/plugins/commons-chunk-plugin/)

### scanEntry
- Type: `Object`
- Default:

```javscript
{
  prefixFilter(name) {
    const arrPath = path.dirname(name).split(path.sep);
    const ext = path.extname(name);
    const newName = arrPath.pop();

    if (ext === '.html') {
      return newName ? newName + ext : name;
    }

    return newName || name;
  }
}
```

使用[jfet-build-block-webpack3](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-webpack3)

### entryPoint
- Type: `Object`
- Default: undefined

使用[jfet-build-block-webpack3](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-webpack3)

### setOutput
- Type: `Object`
- Default:

```javascript
{
  filename: isProduction ? 'js/[name]-[hash:8].js' : 'js/[name].js'
}
```

使用[jfet-build-block-webpack3](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-webpack3)

### defineConstants
- Type: `Object`
- Default: undefined

使用[jfet-build-block-webpack3](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-webpack3)

### resolveAliases
- Type: `Object`
- Default: undefined

使用[jfet-build-block-webpack3](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-webpack3)

### setContext
- Type: `Object`
- Default: undefined

使用[jfet-build-block-webpack3](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-webpack3)

### setDevTool
- Type: `Object`
- Default: undefined

使用[jfet-build-block-webpack3](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-webpack3)

### babel
- Type: `Object`
- Default: 

```javascript
{
  babelrc: false,
  presets: [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-stage-0'),
  ],
  cacheDirectory: true
}
```

使用[jfet-build-block-babel6](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-babel6)

### dot
- Type: `Object`
- Default: undefined

使用[jfet-build-block-dot](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-dot)

### vue
- Type: `Object`
- Default: undefined

使用[jfet-build-block-vue](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-vue)

### assemble
- Type: `Object`
- Default: undefined

使用[jfet-build-block-assemble](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-assemble)

### less
- Type: `Object`
- Default: 

```javascript
{
  minimize: isProduction
}
```

使用[jfet-build-block-less](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-less)

### sass
- Type: `Object`
- Default: 

```javascript
{
  minimize: isProduction
}
```

使用[jfet-build-block-sass](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-sass)

### extractTextVue
- Type: `Object`
- Default: isProduction ? 'css/[name].vue.[chunkhash:8].css' : 'css/[name].vue.css'

使用[jfet-build-block-webpack3](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-webpack3)

### extractTextLess
- Type: `Object`
- Default: isProduction ? 'css/[name].less.[chunkhash:8].css' : 'css/[name].less.css'

使用[jfet-build-block-webpack3](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-webpack3)

### extractTextScss
- Type: `Object`
- Default: isProduction ? 'css/[name].scss.[chunkhash:8].css' : 'css/[name].scss.css'

使用[jfet-build-block-webpack3](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-webpack3)


### image
- Type: `Object`
- Default: 

```javascript
{
  name: 'image/[name]-[hash:8].[ext]',
  limit: 10000
}
```

使用[jfet-build-block-assets url-loader](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-assets)

### imageLoader
- Type: `Object`
- Default: {}

使用[jfet-build-block-assets image-webpack-loader](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-assets)

### svg
- Type: `Object`
- Default: 

```javascript
{
  name: 'image/[name]-[hash:8].[ext]',
  minetype: 'image/svg+xml'
}
```

使用[jfet-build-block-assets url-loader](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-assets)

### font
- Type: `Object`
- Default: 

```javascript
{
    name: 'font/[name]-[hash:8].[ext]'
}
```

使用[jfet-build-block-assets file-loader](http://git.jtjr.com/h5_webtools_grp/workflow/tree/master/packages/jfet-build-block-assets)
