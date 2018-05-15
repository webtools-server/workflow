# 库构建方案

## 安装

```shell
npm i @jyb/jfet-build-preset-library --save
```

## 使用

```javascript
// jfet.config.js
module.exports = {
  build(context) {
    // preset
    context.setPreset('library');
    // config
    context.setConfig({
      rollup: {
        input: '',
        plugins: []
      },
      usePlugin: {},
      plugin: {
        
      },
      output: {},
      watch: {}
    });
  }
};
```
