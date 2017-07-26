/**
 * dot-loader
 */

const loaderUtils = require('loader-utils');
const dot = require('dot');
const fs = require('fs');

function dotLoader() {
  let result = '';
  const options = loaderUtils.getOptions(this) || {};
  const IMG_SRC_REGEX = /\bsrc="([^"]*)"/g;
  const htmlResourceRoot = options.htmlResourceRoot;
  dot.templateSettings.selfcontained = true;
  Object.assign(dot.templateSettings, options.dotSettings);

  result = `module.exports = ${dot.template(fs.readFileSync(this.resourcePath))}`;
  result = result.replace(IMG_SRC_REGEX, (m, s1) => {
    let code = '';

    if (loaderUtils.isUrlRequest(s1, htmlResourceRoot)) {
      const urlRequest = loaderUtils.urlToRequest(s1, htmlResourceRoot);
      code = `';out+='src="';out+=require(${JSON.stringify(urlRequest)});out+='"`;
    } else {
      code = m;
    }

    return code;
  });
  return result;
}

module.exports = dotLoader;
