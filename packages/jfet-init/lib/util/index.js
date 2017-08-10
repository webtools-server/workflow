/**
 * 工具库
 */

/* eslint-disable */
const cache = [
  '',
  ' ',
  '  ',
  '   ',
  '    ',
  '     ',
  '      ',
  '       ',
  '        ',
  '         '
];

function leftPad(str, len, ch) {
  str = str + '';
  len = len - str.length;
  if (len <= 0) {
    return str;
  }

  if (!ch && ch !== 0) {
    ch = ' ';
  }

  ch = ch + '';
  if (ch === ' ' && len < 10) {
    return cache[len] + str;
  }

  let pad = '';
  const isTrue = true;

  while (isTrue) {
    if (len & 1) {
      pad += ch;
    }

    len >>= 1;
    if (len) {
      ch += ch;
    } else {
      break;
    }
  }

  return pad + str;
}

function getTime() {
  const oDate = new Date();
  const year = oDate.getFullYear();
  const month = leftPad(oDate.getMonth() + 1, 2, '0');
  const date = leftPad(oDate.getDate(), 2, '0');
  const hours = leftPad(oDate.getHours(), 2, '0');
  const minutes = leftPad(oDate.getMinutes(), 2, '0');
  const second = leftPad(oDate.getSeconds(), 2, '0');

  return `${year}-${month}-${date} ${hours}:${minutes}:${second}`;
}

function getDate() {
  const oDate = new Date();
  const year = oDate.getFullYear();
  const month = leftPad(oDate.getMonth() + 1, 2, '0');
  const date = leftPad(oDate.getDate(), 2, '0');

  return `${year}-${month}-${date}`;
}

module.exports = {
  leftPad,
  getTime,
  getDate
};