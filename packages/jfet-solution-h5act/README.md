# jfet-solution-h5act

加油宝h5活动前端开发方案

## 安装

全局安装，如果有安装，可以直接跳过

```shell
$ npm i @jyb/jfet-solution-h5act -g
```

## 环境

一共分4个环境，`mock`,`local`,`test`,`prod`

- mock环境，通过`BUILD_ENV=mock`指定，`process.env.NODE_ENV`为`mock`
- local环境，通过`BUILD_ENV=local`指定，`process.env.NODE_ENV`为`local`
- test环境，通过`BUILD_ENV=test`指定，`process.env.NODE_ENV`为`test`
- prod环境，通过`BUILD_ENV=prod`指定，`process.env.NODE_ENV`为`prod`

## abc.json配置

```json
{
  "jfetOptions": { // jfet配置
    "solution": "h5_act"
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
    "defineConstants": { // 定义常量，环境有：local/mock/test/prod/pack
      "test": {
        "ACT_ENV": "test"
      }
    }
  },
  "server": { // server配置
    "opnPath": { // 定义server自动打开路径
      "local": "/public/pages/index.html", // 本地访问路径
      "build": "/act/199701/test/pages/index.html" // 发布访问路径
    },
    "livereload": {
      "watch": "./public/*" // 监听目录，一般不需要修改
    },
    "proxy": [{ // 代理配置
      "method": "post",
      "route": "/proxy/act/index",
      "options": {
        "url": "http://172.16.1.8:9013/hanyi/act_access/act/index"
      }
    }]
  },
  "doc": { // doc配置
    "name": "h5-act", // 文档名
    "token": "21232F297A57A5A743894A0E4A801FC3", // token
    "uploadUrl": "http://172.16.1.10:7001/api/upload" // 上传接口
  },
  "image": { // image配置
    "input": "public/image/*.{jpg,png,gif}",
    "output": "public/image"
  }
}
```


