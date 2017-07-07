/**
 * 文件操作
 */

const fse = require('fs-extra');

function fileExists(filePath) {
    try {
        return fse.statSync(filePath).isFile();
    } catch (e) {
        return false;
    }
}

function readFile(filePath) {
    try {
        return fse.readFileSync(filePath);
    } catch (e) {
        return null;
    }
}

module.exports = {
    fileExists,
    readFile
};
