const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

exports.copyShtml = (dir) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const stat = fs.statSync(path.join(dir, file));
    if (stat && stat.isFile() && /.html/.test(file)) {
      fse.copy(path.join(dir, file), path.join(dir, file.replace('html', 'shtml')));
    }
  });
};

