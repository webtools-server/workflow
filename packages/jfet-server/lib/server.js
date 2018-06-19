/**
 * main
 */

const fs = require('fs');
const http = require('http');
const https = require('https');
const opn = require('opn');
const chalk = require('chalk');
const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const koaProxy = require('koa-proxy');
const Router = require('koa-router');
const browserSync = require('browser-sync');
const util = require('./util');

const koaSSI = require('./middleware/ssi');

function resolve(p) {
  return path.resolve(__dirname, p);
}

class Server {
  constructor(options) {
    this.$options = options;
    this.cwd = options.cwd;
    this.port = options.port;
    this.ssi = options.ssi;
    this.livereload = options.livereload;

    this.app = new Koa();

    // ssi/livereload config
    this.config = {};

    // router && proxy
    this.routerStore = [];
    this.proxy = koaProxy;
  }

  init() {
    const currentPath = path.join(process.cwd(), this.cwd);

    // ssi
    if (this.ssi) {
      this.app.use(koaSSI(currentPath, this.config.ssi));
    }

    // static serve
    this.app.use(serve(currentPath));
  }

  browserSync(options) {
    const liveReloadConfig = this.config.livereload || {};
    const bs = browserSync.create();

    bs.init(Object.assign({
      open: 'external',
      port: 8097,
      notify: false,
      proxy: options.proxy
    }, liveReloadConfig.init));
    bs.watch(liveReloadConfig.watch, {
      interval: 1000
    }).on('change', bs.reload);
  }

  setConfig(options) {
    if (!util.isObject(options)) {
      throw new Error('Config type error.');
    }
    Object.assign(this.config, options);
  }

  setLiveReloadConfig(options) {
    Object.assign(this.liveReloadConfig, options);
  }

  registerRouter(method, rpath, middlewares) {
    if (arguments.length !== 3) {
      throw new Error('registerRouter params error.');
    }

    this.routerStore.push({
      path: rpath,
      method,
      middlewares
    });
  }

  start() {
    // init
    this.init();
    // router
    const router = new Router();
    const routerStore = this.routerStore;
    const opnPath = this.config.opnPath || '';

    routerStore.forEach((rs) => {
      let middlewares = rs.middlewares;

      if (!Array.isArray(middlewares)) {
        middlewares = [middlewares];
      }

      router[rs.method](rs.path, ...middlewares);
    });
    this.app.use(router.routes()).use(router.allowedMethods());

    // body parser
    this.app.use(bodyParser());
    this.app.use(function* (next) {
      yield next;
      if (/\.html/.test(this.url)) {
        this.body = fs.readFileSync(resolve('web/index.html'), 'utf-8');
      }
    });

    // listen
    const port = parseInt(this.config.port || this.port, 10);
    let server = null;
    let listenURL = '';
    if (this.$options.ssl) {
      listenURL = `https://${util.getIPAddress}:${port}`;
      server = https.createServer({
        key: fs.readFileSync(resolve('ssl/jyblifeserver.key')),
        cert: fs.readFileSync(resolve('ssl/jyblifeserver.pem'))
      }, this.app.callback());
    } else {
      listenURL = `http://${util.getIPAddress}:${port}`;
      server = http.createServer(this.app.callback());
    }

    const opnURL = `${listenURL}${opnPath}`;

    server.listen(port, () => {
      console.log(chalk.green(`Server running at ${listenURL}`));

      // livereload
      if (this.livereload) {
        this.browserSync({ proxy: opnURL });
      } else {
        opn(opnURL);
      }
    });
  }
}

module.exports = Server;
