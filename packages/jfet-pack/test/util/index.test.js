/**
 * lib/util
 */

const path = require('path');
const should = require('should');
const util = require('../../lib/util');

describe('lib/util/index.js', () => {
  it('should detect a variable is object', () => {
    should(util.isObject('')).be.equal(false);
    should(util.isObject(123)).be.equal(false);
    should(util.isObject({})).be.equal(true);
    should(util.isObject(null)).be.equal(false);
  });

  it('should detect type', () => {
    should(util.getType('')).be.equal('String');
    should(util.getType(123)).be.equal('Number');
    should(util.getType({})).be.equal('Object');
    should(util.getType(null)).be.equal('Null');
    should(util.getType(false)).be.equal('Boolean');
    should(util.getType([])).be.equal('Array');
  });

  it('should resolve path', () => {
    const r1 = util.resolvePath('abc', () => {});
    const r2 = util.resolvePath([1, 2, 3], val => ++val).join(',');

    should(r1).be.equal('abc');
    should(r2).be.equal([2, 3, 4].join(','));
  });

  it('should try require', () => {
    const r1 = util.tryRequire('../../package.json');
    const r2 = util.tryRequire('../package.json');

    should(r1).be.not.Null();
    should(r2).be.equal(null);
  });

  it('should unique array', () => {
    const r1 = util.uniqueArray([1, 2, 3, 2]).join(',');
    should(r1).be.equal('1,2,3');
  });

  it('should file exists', () => {
    const r1 = util.fileExists(path.join(__dirname, '../..', 'package.json'));
    const r2 = util.fileExists('../package.json');

    should(r1).be.equal(true);
    should(r2).be.equal(false);
  });

  it('should get file size', () => {
    const r1 = util.getFileSize(path.join(__dirname, '../..', 'package.json'));
    const r2 = util.getFileSize('../package.json');

    should(r1).be.not.equal(0);
    should(r2).be.equal(0);
  });
});
