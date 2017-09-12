# 开发常见问题

### init相关

- 执行`jfet init`初始化，默认会初始化到当前执行命令的目录，并且不清空当前目录

如果需要输出到指定目录（相对当前执行命令目录）例如输出到proj：

```shell
$ jfet init -o proj
```

如果需要先清空当前目录，再生成项目

```shell
$ jfet init -f
```

### build相关

- 使用vue开发的时候，如果使用单文件，建议样式只从样式部分内引入，否则会生成两个样式文件

```html
<template></template>
<script>// js code</script>
<style>
@import "reset";

html,
body {
  margin: 0;
  padding: 0;
}
</style>
```

- 在hbs模板中通过`img标签`引入图片，需要先在`入口js`中把图片引入，然后使用`require`引入

引入图片注意要`大于10k`，否则图片会被转为`base64编码`，所以建议`小于10k`的图片通过背景图的方式引入

```javascript
import './img/banner.png';
```

```html
<img src="{{require 'image/banner.png'}}" alt="banner">
```

### server相关

- 如果使用https代理，除了设置`url`外，还需要设置下`host`和`strictSSL`

如果使用`h5act`或者`h5product`解决方案，修改abc.json

```javascript
// 集成测试环境
{
  "method": "post",
  "route": "/proxy/act/index",
  "options": {
    "url": "https://swebsit.jyblife.com/act/index",
    "host": "https://swebsit.jyblife.com",
    "requestOptions": {
      "strictSSL": false
    }
  }
}

// 预发布/正式环境
{ 
  "method": "post",
  "route": "/proxy/act/index",
  "options": {
    "url": "https://sweb.jyblife.com/act/index",
    "host": "https://sweb.jyblife.com",
    "requestOptions": {
      "strictSSL": false
    }
  }
}
```
