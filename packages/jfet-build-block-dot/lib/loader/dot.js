/**
 * dot-loader
 */

const loaderUtils = require('loader-utils');
const dot = require('dot');
const fs = require('fs');

function dotLoader() {
    const options = loaderUtils.getOptions(this);

    Object.assign(dot.templateSettings, options);
    dot.templateSettings.selfcontained = true;

    return `module.exports = ${dot.template(fs.readFileSync(this.resourcePath))}`;
}

module.exports = dotLoader;

