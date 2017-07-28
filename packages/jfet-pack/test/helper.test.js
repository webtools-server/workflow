/**
 * lib/helper
 */

const path = require('path');
const should = require('should');
const helper = require('../lib/helper');
const fse = require('fs-extra');

describe('lib/helper.js', () => {
  it('should create zip', (done) => {
    const zipPath = path.join(__dirname, 'abc.zip');
    const outputPath = path.join(__dirname, 'fixtures');

    helper.createZip(zipPath, outputPath).then(() => {
      fse.removeSync(zipPath);
      done();
    });
  });

  it('should check setting', () => {
    const d1 = {
      uid: '',
      name: '',
      descriptor: '',
      login: false,
      version: '',
      md5: '',
      zip: '',
      patch: '',
      entry: ''
    };
    
    should(helper.checkSetting(d1)).be.equal(true);
  });

  it('should transform xml data', () => {
    const data = {
      package: {
        uid: '123',
        name: 'canye'
      }
    };
    const result = helper.transformXMLData(data);

    should(result.package.length).be.equal(2);
    should(result.package[0].uid).be.equal('123');
    should(result.package[1].name).be.equal('canye');
  });

  it('should get not modified files', () => {
    const newFile = {
      "css/index.css": "../css/index-4f7fd6e8.css",
      "js/index.js": "../js/index-4f7fd6e3.js"
    };
    const oldFile = {
      "css/index.css": "../css/index-4f7fd6e8.css",
      "js/index.js": "../js/index-4f7fd6e5.js"
    };
    const result = helper.getNotModifiedFiles(newFile, oldFile);

    should(result[0]).be.equal(newFile['css/index.css']);
  });
});
