/**
 * helper
 */

const typeOf = require('kind-of');
const moment = require('moment');
const extend = require('extend-shallow');
const fs = require('fs');
const path = require('path');

const hasOwn = Object.prototype.hasOwnProperty;

const helper = {
  requireHelper(resource) {
    if (hasOwn.call(this.resourceMap, resource)) {
      return this.resourceMap[resource];
    }

    return resource;
  },
  manifestHelper() {
    return JSON.stringify(this.resourceMap);
  },
  inlineHelper(resource) {
    let relativePath = this.options.publicPath;
    if (!path.isAbsolute(relativePath)) {
      relativePath = path.join(process.cwd(), relativePath);
    }

    const mapName = this.resourceMap[resource];
    if (!mapName) {
      return '';
    }

    const name = resource.substring(0, resource.lastIndexOf('.'));
    const newName = mapName.slice(mapName.lastIndexOf(name) - mapName.length);

    return fs.readFileSync(path.join(relativePath, newName), 'utf-8');
  },
  momentHelper(str, pattern, options) {
    // if no args are passed, return a formatted date
    if (!str && !pattern) {
      moment.locale('en');
      return moment().format('MMMM DD, YYYY');
    }

    // we can extend str and pattern since `extend` ignores strings
    // and they might be options/context objects
    let opts = extend({ locale: 'en' }, str, pattern, options);
    opts = extend({}, opts, opts.hash);

    // set the language to use
    moment.locale(opts.lang || opts.locale);
    if (opts.hash) {
      if (opts.context) {
        opts.hash = extend({}, opts.hash, opts.context);
      }

      const date = moment(str);
      for (const key in opts.hash) {
        if (date[key]) {
          return date[key](opts.hash[key]);
        }
        console.log(`moment.js does not support "${key}"`);
      }
    }

    if (typeOf(str) === 'object' && typeof pattern === 'string') {
      return moment(str).format(pattern);
    }

    // if only a string is passed, assume it's a date pattern ('YYYY')
    if (typeof str === 'string' && !pattern) {
      return moment().format(str);
    }

    return moment(str).format(pattern);
  }
};

module.exports = helper;
