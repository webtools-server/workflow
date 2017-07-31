# jfet

前端开发工具

## 安装

```shell
npm i @jyb/jfet -g
```

## 使用

```shell
jfet -v
jfet -h
```

## 文档

- 开发命令插件，`doc/DevelopPlugin.md`

## 配置

### jfet.config.js

工具总配置，会获取和当前执行的命令同名的函数执行

```javascript
module.exports = {
  build(abc, context) {
    // 假如插件名为build，abc应该为abc.json文件中的build字段的值
    // context为configFunc（jfet.config.js配置中的命令函数）传入的值，context可以看对应的命令插件的文档
  },
  server(abc, context) {},
  pack(abc, context) {}
}
```

### abc.json

子配置，执行命令的时候会读取，并且把跟当前命令同名的字段的值，作为jfet.config.js配置中同名的函数的第一个参数注入，一般用于一个项目有多个子项目的情况

```javascript
{
  "jfetOptions": { // 跟package.json中的jfetOptions字段一致
    "commandPlugin": "./index.js",
    "configFilePath": "../../"
  },
  "build": {}, // 可以在jfet.config.js中的build函数第一个参数获取到
  "server": {},
  "pack": {}
}
```

### package.json

如果当前目录下的`package.json`中有`jfetOptions`字段，会优先使用`jfetOptions`中的设置，不过`abc.json`中的`jfetOptions`优先级要高。

`jfetOptions`有两个字段：

- `commandPlugin`，优先查找`jfetOptions.commandPlugin`作为插件入口
- `configFilePath`，优先查找`jfetOptions.configFilePath`作为配置文件路径

```javascript
"jfetOptions": {
  "commandPlugin": "./lib/index.js",
  "configFilePath": "demo"
}
```