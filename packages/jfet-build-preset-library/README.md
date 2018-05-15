# 库构建方案

主要用于公共库的构建，构建底层基于rollup

## 安装

```shell
npm i @jyb/jfet-build-preset-library --save
```

## 使用

```javascript
// jfet.config.js
const path = require('path');
module.exports = {
  build(abc, context) {
    context.setPreset('library');
    context.setConfig({
      rollup: {
        input: path.join(process.cwd(), 'src/index.js'),
      },
      output: {
        name: 'GlobalLib',
        file: path.join(process.cwd(), 'dist/bundle.js'),
      }
    });
  }
};
```

## 配置

### rollup

rollup配置，[文档](https://rollupjs.org/guide/en#using-config-files)

- Type: `Object`
- Default: 

```javascript
{
  input: '',
  plugins: []
}
```

### usePlugin

默认开启使用的插件，true为开启，false为关闭

- Type: `Object`
- Default:

```javascript
{
  resolve: true,
  commonjs: true,
  eslint: true,
  dot: true,
  babel: true,
  uglify: false
};
```

### plugin

默认插件配置

- Type: `Object`
- Default:

```javascript
{
  resolve: {}, // @see https://github.com/rollup/rollup-plugin-node-resolve
  commonjs: {}, // @see https://github.com/rollup/rollup-plugin-commonjs
  eslint: { // @see https://github.com/TrySound/rollup-plugin-eslint
    include: path.join(process.cwd(), 'src/**/**.js'),
    exclude: []
  },
  dot: {
    include: ['**/*.dot', '**/*.tpl'],
    exclude: ['**/index.html'],
    templateSettings: { selfcontained: true } // @see http://olado.github.io/doT/index.html
  },
  babel: { // @see https://github.com/rollup/rollup-plugin-babel
    babelrc: false,
    exclude: path.join(process.cwd(), 'node_modules/**'),
    presets: [
      [
        require.resolve('babel-preset-env'),
        {
          modules: false
        }
      ]
    ],
    plugins: [
      require.resolve('babel-plugin-external-helpers'),
      require.resolve('babel-plugin-transform-object-assign')
    ]
  },
  uglify: {} // @see https://github.com/TrySound/rollup-plugin-uglify
}
```

### output

构建输出配置，[outputOptions](https://rollupjs.org/guide/en#rollup-rollup)

- Type: `Object`
- Default:

```javascript
{
  format: 'umd',
  name: 'LIB',
  file: path.join(process.cwd(), 'dist/bundle.js'),
  sourcemap: false
}
```

### watch

watch配置，[watchOptions](https://rollupjs.org/guide/en#rollup-watch)

- Type: `Object`
- Default:

```javascript
{
  include: path.join(process.cwd(), 'src/**'),
  exclude: path.join(process.cwd(), 'node_modules/**')
}
```



