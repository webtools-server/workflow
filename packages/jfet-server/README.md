# jfet-server

server命令插件

## 功能

- 支持代理，路由
- 支持ssi
- 支持livereload

## 安装

需要全局安装，如果已经安装过，可以跳过

```shell
npm i @jyb/jfet -g
npm i @jyb/jfet-server -g
```

## 使用

```shell
jfet server --cwd/-c <cwd>
jfet server --port/-p <port>
jfet server --ssi/-s
jfet server --livereload/-l

jfet server --version
jfet server --help
```

## 配置文件

```javascript
module.exports = {
  server(abc, context) {
    const proxy = context.proxy;

    // ssi/livereload configuration
    // see https://github.com/yanni4night/node-ssi
    // see https://www.browsersync.io/docs/api
    context.setConfig({
      opnPath: '/public/pages/index.html', // 自动打开地址
      ssi: {
        baseDir: '..',
        ext: '.html'
      },
      livereload: {
        init: {
          open: 'external',
          port: 8097,
          notify: false,
          proxy: ''
        },
        watch: ''
      }
    });
    
    // router
    context.registerRouter('get', '/home', function*(next) {});
    context.registerRouter('get', '/api/detail', proxy({
      url: 'http://alicdn.com/index.js'
    }));
  }
};
```
