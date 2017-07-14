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

class Server {
    constructor(cwd, port, livereload) {
        this.cwd = cwd;
        this.port = port;
        this.livereload = livereload;

        this.app = new Koa();

        // router && proxy
        this.routerStore = [];
        this.proxy = koaProxy;
        this.init();
    }

    init() {
        // body parser
        this.app.use(bodyParser());

        // static serve
        this.app.use(serve(path.join(process.cwd(), this.cwd)));
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
