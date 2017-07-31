/**
 * lib/pack
 */

const path = require('path');
const should = require('should');
const Pack = require('../lib/pack');
const fse = require('fs-extra');

describe('lib/pack.js', () => {
  it('should set config', () => {
    const pack = new Pack();
    pack.setConfig({ ssiPattern: '*.html' });

    should(pack.configuration.ssiPattern).be.equal('*.html');
  });
});