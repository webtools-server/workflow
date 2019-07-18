# 开发解决方案

## 安装

如果没有安装，需要先安装

```shell
$ npm i jyb_jfet jyb_jfet-init -g
```

## 初始化

选择模板`template-jfet-solution`，解决方案命名规范必须为`jfet-solution-xxx`

```shell
$ jfet init
```

## 修改lib/index.js

入口文件格式和`jfet.config.js`格式一致

```javascript
module.exports = {
  build(abc, context) {

  }
  server(abc, context) {

  }
}
```

## 修改使用解决方案的abc.json配置

```javascript
{
  "jfetOptions": {
    "solution": "" // 解决方案名称
  }
}
```


