/**
 * 解决方案
 */

const path = require('path');
const util = require('../util');
const constant = require('../constant');

const { SOLUTION_PREFIX, COMMAND_PREFIX } = constant;

const defaultOptions = {
  solution: '', // 解决方案名称
  solutionEntry: '' // 解决方案入口
};

class Solution {
  constructor(options) {
    this.name = '';
    this.entry = null;
    this.opts = Object.assign({}, defaultOptions, options);
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    this.loadSolutionByName();
    this.loadSolutionByEntry();
  }

  /**
   * 通过指定入口加载解决方案
   */
  loadSolutionByEntry() {
    let { solutionEntry } = this.opts;
    if (!solutionEntry) return;
    // 如果不是指定的路径不是绝对路径
    if (!path.isAbsolute(solutionEntry)) {
      solutionEntry = path.join(process.cwd(), solutionEntry);
    }
    this.name = solutionEntry;
    this.entry = util.loadPackage(solutionEntry);
  }

  /**
   * 通过指定名称加载解决方案
   */
  loadSolutionByName() {
    const { solution } = this.opts;
    if (!solution) return;
    this.name = solution;
    this.entry = util.loadPackage(SOLUTION_PREFIX.map(s => `${s}${solution}`));
  }

  /**
   * 检查插件
   */
  checkPlugins() {
    let result = {};
    const ctxEntry = this.entry;

    if (ctxEntry) {
      result = Object.keys(ctxEntry).reduce((entries, entry) => {
        entries[entry] = {
          installed: !!util.loadPackage(COMMAND_PREFIX.map(c => `${c}${entry}`), false)
        };
        return entries;
      }, {});
    }
    return result;
  }
}

module.exports = Solution;
