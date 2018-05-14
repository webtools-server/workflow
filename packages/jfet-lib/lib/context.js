/**
 * lib context
 */

const BuildOptions = require('./options/build');
const TestOptions = require('./options/test');

const defaultContext = {
  on: () => {}
};

class LibContext {
  constructor(argv) {
    this.argv = argv || {};
    // config
    this.buildConfig = {};
    this.testConfig = {};
    // context
    this.buildCtx = Object.assign({}, defaultContext);
    this.testCtx = Object.assign({}, defaultContext);
  }
  start() {
    const argv = this.argv;
    // 构建
    if (argv.build) {
      this.buildCtx = new BuildOptions(argv, this.buildConfig);
    }
    // 单元测试
    if (argv.test) {
      this.textCtx = new TestOptions(argv, this.testConfig);
    }
  }
  setConfig(name, options = {}) {
    if (Object.prototype.toString.call(options) !== '[object Object]') return;
    switch (name) {
      case 'build':
        this.buildConfig = options;
        break;
      case 'test':
        this.testConfig = options;
        break;
      default:
        break;
    }
  }
  getContext(name) {
    switch (name) {
      case 'build': return this.buildCtx;
      case 'test': return this.testCtx;
      default: return Object.assign({}, defaultContext);
    }
  }
}

module.exports = LibContext;
