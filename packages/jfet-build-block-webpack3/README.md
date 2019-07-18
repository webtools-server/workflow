# webpack3构建功能块

内置[webpack3](https://webpack.js.org/configuration/),[extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin),[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

## 安装

```shell
npm i jyb_jfet-build-block-webpack3 --save
```

## 使用

更多用法见`jfet-build`的`开发构建功能块`[文档](../jfet-build/doc/DevelopBlock.md)


```javascript
const { scanEntry } = require('jyb_jfet-build-block-webpack3');

// preset
createConfig(context, [
  scanEntry()
]);
```

## 内置功能块

### resolveAliases

配置的`resolve.alias`，[配置文档](https://webpack.js.org/configuration/resolve/#resolve-alias)

### setContext

配置的`context`，[配置文档](https://webpack.js.org/configuration/entry-context/#context)

### defineConstants

配置`DefinePlugin`，[配置文档](https://webpack.js.org/plugins/define-plugin/)

### setDevTool

配置的`devtool`，[配置文档](https://webpack.js.org/configuration/devtool/#devtool)

### setOutput

配置的`output`，[配置文档](https://webpack.js.org/configuration/output/)

### performance

配置的`performance`，[配置文档](https://webpack.js.org/configuration/performance/#performance)

### resolve

配置的`resolve`, [配置文档](https://webpack.js.org/configuration/resolve/#resolve)

### addPlugins

添加插件，[配置文档](https://webpack.js.org/configuration/plugins/)

### entryPoint

配置的`entry`，[配置文档](https://webpack.js.org/configuration/entry-context/#entry)

### scanEntry

扫描入口

```javascript
scanEntry({
  pattern: '', // glob
  prefixFilter(item) {
    return item;
  }
});
```

### extractText

基于[extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin)

```javascript
extractText('css/[name].[contenthash:8].css');
```

### htmlPlugin

基于[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

```jsdoc
@param {Object} [options]
@param {Object} [options.scan]
@param {String} [options.scan.pattern]
@param {Function} [options.scan.prefixFilter]
@param {Function} [options.setConfig]
```

```javascript
htmlPlugin({
  scan: {}, // 参考scanEntry
  setConfig(k, curr) {
    // k - 扫描结果的key
    // curr - 扫描结果的value
  }
})
```

## API

### webpackCore

webpack实例，例如：

```javascript
new webpackCore.optimize.UglifyJsPlugin()
```

### createConfig

创建配置

```jsdoc
@param {Object} context - build实例
@param {Function[]} configSetters - block返回的函数
```

### customConfig

自定义配置

```javascript
customConfig({
  entry: './entry.js',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  }
});
```

### commonDoneHandler

webpack compile完成处理函数，一般给preset使用

