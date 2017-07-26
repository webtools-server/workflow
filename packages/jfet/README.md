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

## 配置

jfet.config.js

```javascript
module.exports = {
  build(abc, context) {},
  server(abc, context) {},
  pack(abc, context) {}
}
```

abc.json

```javascript
{
  "jfetOptions": {
    "commandPlugin": "./index.js",
    "configFilePath": "../../"
  },
  "build": {}, // 可以在jfet.config.js中的build函数第一个参数获取到
  "server": {},
  "pack": {}
}
```

## 文档

- [开发一个命令插件]()