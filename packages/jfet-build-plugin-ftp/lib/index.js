/**
 * 构建FTP插件
 * @see https://www.npmjs.com/package/node-ssh
 * @see https://www.npmjs.com/package/ssh2
 */

const NodeSSH = require('node-ssh');
const fse = require('fs-extra');
const path = require('path');

/* eslint-disable space-before-function-paren */
module.exports = function(options) {
  const defaultOptions = {
    localDir: '',
    remoteDir: '',
    isDelete: false
  };
  const opts = Object.assign({}, defaultOptions, options);

  return function(next) {
    // 虽然ftp上传是异步的，但是这里上传的是sourcemap，理论不会影响后续的task
    this.on('after', () => {
      let localDir = opts.localDir;
      const remoteDir = opts.remoteDir;
      if (!localDir || !remoteDir) {
        throw new Error('localDir and remoteDir can not empty.');
      }

      // 如果不是绝对路径
      if (!path.isAbsolute(localDir)) {
        localDir = path.join(process.cwd(), localDir);
      }

      const ssh = new NodeSSH();

      ssh.connect(opts).then(() => {
        ssh.putDirectory(localDir, remoteDir)
          .then(() => {
            if (opts.isDelete) {
              fse.removeSync(localDir);
            }
            console.log(`sftp successfully, local: ${localDir}; remote: ${opts.host}, ${remoteDir}`);
          }, (error) => {
            throw new Error(error);
          });
      });
    });
    next();
  };
};
