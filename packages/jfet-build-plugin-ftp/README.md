# 构建FTP插件

支持FTP上传文件，例如sourcemap文件

## 安装

```shell
npm i @jyb/jfet-build-plugin-ftp --save
```

## 使用

```javascript
const ftpPlugin = require('@jyb/jfet-build-plugin-ftp');

this.usePlugin(ftpPlugin({
  host: '172.16.1.8',
  username: 'root',
  port: 22,
  password: '',
  localDir: path.join(__dirname, 'map'), // 本地目录
  remoteDir: '/data/www/tracker/map', // 远程目录
  isDelete: false // 上传成功是否删除本地目录
}));
```

## 相关文档

- [node-ssh](https://www.npmjs.com/package/node-ssh)
- [ssh2](https://www.npmjs.com/package/ssh2)
