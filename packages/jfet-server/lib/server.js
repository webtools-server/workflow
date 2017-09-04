/**
 * main
 */

const fs = require('fs');
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

class Server {
  constructor(cwd, port, ssi, livereload) {
    this.cwd = cwd;
    this.port = port;
    this.ssi = ssi;
    this.livereload = livereload;

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
      this.body = fs.readFileSync(path.join(__dirname, 'web/404.html'), 'utf-8');
    });

    // listen
    const port = parseInt(this.port, 10);
    const listenURL = `http://${util.getIPAddress}:${port}`;
    const opnURL = `${listenURL}${opnPath}`;

    this.app.listen(port);
    console.log(chalk.green(`server listening on ${listenURL}`));

    // livereload
    if (this.livereload) {
      this.browserSync({ proxy: opnURL });
    } else {
      opn(opnURL);
    }
  }
}

module.exports = Server;
