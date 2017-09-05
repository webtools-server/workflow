/**
 * post install
 */

const exec = require('child_process').exec;
const index = require('../lib');

const COMMAND_PREFIX = '@jyb/jfet-';
const notInstalled = [];

Object.keys(index).forEach((command) => {
  const commandName = COMMAND_PREFIX + command;
  const pkg = tryRequire(commandName);
  if (!pkg) {
    notInstalled.push(commandName);
  }
});

if (notInstalled.length) {
  const installPlugin = notInstalled.join(' ');
  console.log(`正在安装：${installPlugin}`);
  exec(`npm i -g ${installPlugin}`, (error, stdout) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(stdout);
  });
}

function tryRequire(resource) {
  try {
    /* eslint-disable import/no-dynamic-require */
    const result = require(resource);
    return result;
  } catch (e) {
    return null;
  }
}
