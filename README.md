# 前端开发工具

该仓库不再维护，新仓库：http://git.jtjr.com/jfet/workflow

插件化，具备项目初始化，构建，调试，文档等功能

## 插件

- jfet-init 初始化项目
- jfet-build 构建打包
- jfet-server 调试服务
- jfet-pack 离线包
- jfet-doc 生成发布文档
- jfet-image 图片处理插件

## 发布

发布前，需要先`把本地的修改都提交`，并且需要先切换npm registry为`http://npm.jyblife.com/`

```shell
npm run publish
```

## 测试

```shell
npm test
```

## 文档

```shell
npm run doc
```

全局安装nrm，设置内部npm registry

$ npm i nrm -g
$ nrm add jnpm http://npm.jyblife.com/
$ nrm use jnpm
全局安装jfet

$ npm i jyb_jfet -g
因为jyb_jfet-build涉及到node-sass的安装，可以修改.npmrc文件，增加下面内容：

sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
安装常用插件和解决方案

$ npm i jyb_jfet-init -g
$ npm i jyb_jfet-solution-h5act -g
$ npm i jyb_jfet-solution-h5product -g
