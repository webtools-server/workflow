# jfet-server

server命令插件

## 功能

- 支持代理，路由
- 支持ssi
- 支持livereload(TODO)

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
    server(context) {
        const proxy = context.proxy;

        // ssi configuration
        // see https://github.com/yanni4night/node-ssi
        context.setSSIConfig({
            baseDir: '..',
            ext: '.html'
        });
        
        // router
        context.registerRouter('get', '/home', function*(next) {});
        context.registerRouter('get', '/api/detail', proxy({
            url: 'http://alicdn.com/index.js'
        }));
    }
};
```
