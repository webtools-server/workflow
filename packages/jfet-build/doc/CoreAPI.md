# 核心API

## core 核心方法

源码位置：`lib/core/index.js`

### core.createConfig

创建webpack构建配置

```jsdoc
/**
 * 创建webpack配置
 * @param {object}     initialContext
 * @param {object}     initialContext.webpack
 * @param {object}     initialContext.webpackVersion 
 * @param {Function[]} configSetters 功能块
 * @return {object}
 */
```

```javascript
core.createConfig(context, [
  sass(),
  babel(),
  dot()
]);
```

### core.group

功能块分组

```jsdoc
/**
 * 设置blocks group
 * @param {Function[]} configSetters
 * @return {Function}
 */
```

```javascript
const g1 = core.group([ sass(), dot() ]);
const g2 = core.group([ less(), art() ]);

core.createConfig(context, [ g1(), g2() ]);
```

### core.env

根据环境设置功能块组，根据`process.env.NODE_ENV`使用对应环境的功能块组

```jsdoc
/**
 * 根据环境设置blocks
 * @param {string} envName development/production
 * @param {Function[]} configSetters
 * @return {Function}
 */
```

```javascript
const dev = core.env('development', [ sass(), dot() ]);
const prod = core.env('production', [ less(), art() ]);

core.createConfig(context, [ dev(), prod() ]);
```

### core.match

匹配设置功能块组

```jsdoc
/**
 * match glob like `*.css` or `{*.js, *.jsx}`
 * @param {string|RegExp|Function|Array} test
 * @param {object} [options]
 * @param {string|Function|RegExp|Array|object} [options.include]
 * @param {string|Function|RegExp|Array|object} [options.exclude]
 * @param {Function[]} configSetters 
 * @return {Function}
 */
```

```javascript
const m1 = core.match(/\.scss$/, [sass()]);
const m2 = core.match(/\.less$/, [less()]);

core.createConfig(context, [ m1(), m2() ]);
```

## util 工具方法

源码位置：`lib/core/util.js`

### util.merge

合并webpack配置

```jsdoc
/**
 * 配置合并
 * @param {Object} configSnippet 配置片段
 * @return {Function}
 */
```

```javascript
util.merge({
  resolve: {
    alias: {}
  }
});
```

### util.addLoader

添加webpack loader

```jsdoc
/**
 * 添加loader
 * @param {Object} loaderDef loader配置
 * @return {Function}
 */
```

```javascript
util.addLoader({
  test: /\.art$/,
  use: [{
    loader: 'art-template-loader'
  }]
});
```

### util.addPlugin

添加webpack插件

```jsdoc
/**
 * 添加插件
 * @param {Array|Object} plugin
 * @return {Function}
 */
```

```javascript
util.addPlugin(
  new ManifestPlugin()
);
```

### util.scan

查找文件，基于[glob](https://github.com/isaacs/node-glob)

```jsdoc
/**
 * 查找入口
 * @param {Object} options
 * @param {String} options.pattern glob like `*.css` or `{*.js, *.jsx}`
 * @param {Function} options.prefixFilter 过滤函数
 * @return {Object}
 */
```

```javascript
util.scan(
  pattern: 'pages/**/*.js',
  prefixFilter(name) {
    return name;
  }
);
```

