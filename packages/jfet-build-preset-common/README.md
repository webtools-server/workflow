# 通用构建方案

`build`默认使用的构建方案，支持：

- jyb_jfet-build-block-assets
- jyb_jfet-build-block-babel6
- jyb_jfet-build-block-dot
- jyb_jfet-build-block-less
- jyb_jfet-build-block-webpack3
- jyb_jfet-build-block-vue
- jyb_jfet-build-block-assemble
- jyb_jfet-build-block-sass

## 安装

```shell
npm i jyb_jfet-build-preset-common --save
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

使用[jfet-build-block-manifest](../jfet-build-block-manifest/README.md)

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

使用[jfet-build-block-webpack3](../jfet-build-block-webpack3/README.md)

### entryPoint
- Type: `Object`
- Default: undefined

使用[jfet-build-block-webpack3](../jfet-build-block-webpack3/README.md)

### setOutput
- Type: `Object`
- Default:

```javascript
{
  filename: isProduction ? 'js/[name]-[hash:8].js' : 'js/[name].js'
}
```

使用[jfet-build-block-webpack3](../jfet-build-block-webpack3/README.md)

### defineConstants
- Type: `Object`
- Default: undefined

使用[jfet-build-block-webpack3](../jfet-build-block-webpack3/README.md)

### resolveAliases
- Type: `Object`
- Default: undefined

使用[jfet-build-block-webpack3](../jfet-build-block-webpack3/README.md)

### setContext
- Type: `Object`
- Default: undefined

使用[jfet-build-block-webpack3](../jfet-build-block-webpack3/README.md)

### setDevTool
- Type: `Object`
- Default: undefined

使用[jfet-build-block-webpack3](../jfet-build-block-webpack3/README.md)

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

使用[jfet-build-block-babel6](../jfet-build-block-babel6/README.md)

### dot
- Type: `Object`
- Default: undefined

使用[jfet-build-block-dot](../jfet-build-block-dot/README.md)

### vue
- Type: `Object`
- Default: undefined

使用[jfet-build-block-vue](../jfet-build-block-vue/README.md)

### assemble
- Type: `Object`
- Default: undefined

使用[jfet-build-block-assemble](../jfet-build-block-assemble/README.md)

### less
- Type: `Object`
- Default: 

```javascript
{
  minimize: isProduction
}
```

使用[jfet-build-block-less](../jfet-build-block-less/README.md)

### sass
- Type: `Object`
- Default: 

```javascript
{
  minimize: isProduction
}
```

使用[jfet-build-block-sass](../jfet-build-block-sass/README.md)

### extractTextVue
- Type: `Object`
- Default: isProduction ? 'css/[name].vue.[chunkhash:8].css' : 'css/[name].vue.css'

使用[jfet-build-block-webpack3](../jfet-build-block-webpack3/README.md)

### extractTextLess
- Type: `Object`
- Default: isProduction ? 'css/[name].less.[chunkhash:8].css' : 'css/[name].less.css'

使用[jfet-build-block-webpack3](../jfet-build-block-webpack3/README.md)

### extractTextScss
- Type: `Object`
- Default: isProduction ? 'css/[name].scss.[chunkhash:8].css' : 'css/[name].scss.css'

使用[jfet-build-block-webpack3](../jfet-build-block-webpack3/README.md)


### image
- Type: `Object`
- Default: 

```javascript
{
  name: 'image/[name]-[hash:8].[ext]',
  limit: 10000
}
```

使用[jfet-build-block-assets url-loader](../jfet-build-block-assets/README.md)

### imageLoader
- Type: `Object`
- Default: {}

使用[jfet-build-block-assets image-webpack-loader](../jfet-build-block-assets/README.md)

### svg
- Type: `Object`
- Default: 

```javascript
{
  name: 'image/[name]-[hash:8].[ext]',
  minetype: 'image/svg+xml'
}
```

使用[jfet-build-block-assets url-loader](../jfet-build-block-assets/README.md)

### font
- Type: `Object`
- Default: 

```javascript
{
    name: 'font/[name]-[hash:8].[ext]'
}
```

使用[jfet-build-block-assets file-loader](../jfet-build-block-assets/README.md)
