# jfet-doc

生成gitbook文档

## 文档

- 快速开始，`doc/QuickStart.md`

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
jfet doc // 生成发布文档
jfet doc --serve/-s // gitbook文档服务
jfet doc --init/-i // 初始化gitbook文档

jfet doc --version
jfet doc --help
```

## 配置文件

```javascript
module.export = {
  doc: {
    name: '',
    token: '21232F297A57A5A743894A0E4A801FC3',
    uploadUrl: 'http://127.0.0.1:7001/api/upload'
  }
  /* 同时支持函数
  doc() {
    return {
      name: '',
      token: '21232F297A57A5A743894A0E4A801FC3',
      uploadUrl: 'http://127.0.0.1:7001/api/upload'
    }
  }
  */
}
```
