/**
 * main
 */

const opn = require('opn');
const chalk = require('chalk');
const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const koaProxy = require('koa-proxy');
const Router = require('koa-router');
const util = require('./util');

const koaSSI = require('./middleware/ssi');

class Server {
    constructor(cwd, port, ssi, livereload) {
        this.cwd = cwd;
        this.port = port;
        this.ssi = ssi;
        this.livereload = livereload;

        this.app = new Koa();

        // ssi
        this.ssiConfig = {};

        // router && proxy
        this.routerStore = [];
        this.proxy = koaProxy;

        this.init();
    }

    init() {
        // body parser
        this.app.use(bodyParser());

        if (this.ssi) {
            this.app.use(koaSSI(this.ssiConfig));
        }

        // static serve
        this.app.use(serve(path.join(process.cwd(), this.cwd)));
    }

    setSSIConfig(options) {
        Object.assign(this.ssiConfig, options);
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
        // router
        const router = new Router();
        const routerStore = this.routerStore;

        routerStore.forEach((rs) => {
            let middlewares = rs.middlewares;

            if (!Array.isArray(middlewares)) {
                middlewares = [middlewares];
            }

            router[rs.method](rs.path, ...middlewares);
        });
        this.app.use(router.routes()).use(router.allowedMethods());

        // listen
        const port = parseInt(this.port, 10);
        const opnURL = `http://${util.getIPAddress}:${port}`;

        this.app.listen(port);
        console.log(chalk.green(`server listening on ${opnURL}`));

        // open default browser
        opn(opnURL);
    }
}

module.exports = Server;
