# jfet-solution-h5product

加油宝h5产品前端开发方案

## 安装

全局安装，如果有安装，可以直接跳过

```shell
$ npm i jyb_jfet-solution-h5product -g
```

## 环境

一共分4个环境，`mock`,`local`,`test`,`prod`,`pack`

每个环境对应有`process.env.BUILD_ENV`，值为`BUILD_ENV`设定的值

- mock环境，通过`BUILD_ENV=mock`指定，`process.env.NODE_ENV`为`mock`
- local环境，通过`BUILD_ENV=local`指定，`process.env.NODE_ENV`为`local`
- test环境，通过`BUILD_ENV=test`指定，`process.env.NODE_ENV`为`test`
- prod环境，通过`BUILD_ENV=prod`指定，`process.env.NODE_ENV`为`production`
- pack环境，通过`BUILD_ENV=pack`指定，当`PACK_ENV=prod`,`process.env.NODE_ENV`为`production`；当`PACK_ENV=test`,`process.env.NODE_ENV`为`test`

## abc.json配置

```json
{
  "jfetOptions": { // jfet配置
    "solution": "h5product"
  },
  "build": { // build配置
    "entry": { // 自定义入口，如果设置了就会禁用自动扫描入口
      "index": "./pages/index.js"
    },
    "commonsChunk": { // 公共chunks设置
      "vendor": { // name
        "libs": ["vue"], // 公共库
        "options": { // commonChunks配置，https://webpack.js.org/plugins/commons-chunk-plugin/#components/sidebar/sidebar.jsx
          "chunks": ["index"]
        }
      }
    },
    "releasePath": "../../release/act/199701/test", // 发布的路径
    "publicPath": { // config为test/prod/pack的时候，静态资源的路径
      "test": "/act/199701/test/",
      "prod": "/act/199701/test/",
      "pack": "../"
    },
    "resolveAlias": { // resolve.alias，路径相对于该配置，内置有assets，components，services
      "mock": "./mock"
    },
    "defineConstants": { // 定义常量，环境有：local/mock/test/prod/pack
      "test": {
        "ACT_ENV": "test"
      }
    },
    "imageLimit": 10000, // 图片limit，小于这个值，图片会使用base64
    "inPages": true, // 生成的html是否放置在pages目录下
    "useShtml": false, // 是否生成shtml文件
    "sftp": {
      "prod": true // 也可以为对象类型，设置build-plugin-ftp的选项
    },
    "copy": [{ // 复制文件配置
      "from": "",
      "to": ""
    }]
  },
  "server": { // server配置
    "port": 3000, // 服务端口
    "opnPath": { // 定义server自动打开路径
      "local": "/public/pages/index.html", // 本地访问路径
      "build": "/act/199701/test/pages/index.html" // 发布访问路径
    },
    "livereload": {
      "watch": "./public/*", // 监听目录，一般不需要修改
      "init": {
        "port": 8097 // 代理服务端口
      }
    },
    "proxy": [{ // 代理配置
      "method": "post",
      "route": "/proxy/act/index",
      "options": {
        "url": "http://172.16.1.8:9013/hanyi/act_access/act/index"
      }
    }]
  },
  "pack": { // 离线包配置
    "outputPath": "product/baina",
    "releasePath": "../../release/static/h5zip",
    "zipUrl": {
      "test": "http://beta.branch.jtjr.com:8901/static/h5zip",
      "prod": "http://beta.branch.jtjr.com:8901/static/h5zip"
    },
    "app": {
      "uid": 10000,
      "entry": "product/baina/pages/index.html", 
      "name": "白拿商城",
      "desc": "白拿商城免费拿",
      "login": false
    }
  },
  "image": { // image配置
    "input": "../../release/act/199701/test/image/*.{jpg,png,gif}",
    "output": "../../release/act/199701/test/image"
  }
}
```

