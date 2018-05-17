# jfet-doc

生成gitbook文档

## 功能

- 支持生成gitbook文档
- 支持发布文档

## 安装

需要全局安装，如果已经安装过，可以跳过

```shell
npm i @jyb/jfet -g
npm i @jyb/jfet-doc -g
```

## 使用

```shell
jfet doc --build // 生成发布文档
jfet doc --serve // gitbook文档服务
jfet doc --init // 初始化gitbook文档
jfet doc --install // 安装gitbook插件
jfet doc --publish // 发布文档

jfet doc --name '' --token ''
jfet doc --version
jfet doc --help
```

## 配置文件

```javascript
const path = require('path');
module.export = {
  doc() {
    return {
      name: '', // 文档名
      timeout: 10000, // 上传超时，单位ms
      fileDir: '_book', // 默认当前目录下的_book文件夹
      token: '21232F297A57A5A743894A0E4A801FC3',
      uploadUrl: 'http://doc.fe.jyb.com/api/upload'
    }
  }
}
```
