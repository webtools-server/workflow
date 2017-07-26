/**
 * block core
 */

const globToRegex = require('glob-to-regexp');
const blockUtils = require('./util');

exports.createConfig = createConfig;
exports.group = group;
exports.env = env;
exports.match = match;

const isFunction = value => typeof value === 'function';

/**
 * 创建webpack配置
 * @param {object}     initialContext
 * @param {object}     initialContext.webpack
 * @param {object}     initialContext.webpackVersion 
 * @param {Function[]} configSetters
 * @return {object}
 */
function createConfig(initialContext, configSetters) {
  if (!initialContext) {
    throw new Error('No initial context passed.');
  }
  if (!Array.isArray(configSetters)) {
    throw new Error('Expected parameter \'configSetters\' to be an array of functions.');
  }

  const context = Object.assign({}, initialContext);

  const baseConfig = {
    resolve: {
      extensions: ['.js', '.json']
    },
    module: {
      rules: []
    },
    plugins: []
  };

  configSetters = filterNotFunction(configSetters);
  invokePreHooks(configSetters, context);
  const config = invokeConfigSetters(configSetters, context, baseConfig);
  const postProcessedConfig = invokePostHooks(configSetters, context, config);

  return postProcessedConfig;
}

/**
 * 根据环境设置blocks
 * @param {string} envName development/production
 * @param {Function[]} configSetters
 * @return {Function}
 */
function env(envName, configSetters) {
  const currentEnv = process.env.NODE_ENV || 'development';

  if (currentEnv !== envName) {
    return () => config => config;
  }
  return group(configSetters);
}

/**
 * 设置blocks group
 * @param {Function[]} configSetters
 * @return {Function}
 */
function group(configSetters) {
  configSetters = filterNotFunction(configSetters);

  const pre = getHooks(configSetters, 'pre');
  const post = getHooks(configSetters, 'post');

  const groupBlock = context => config => invokeConfigSetters(configSetters, context, config);

  return Object.assign(groupBlock, { pre, post });
}

/**
 * match glob like `*.css` or `{*.js, *.jsx}`
 * @param {string|RegExp|Function|Array} test
 * @param {object} [options]
 * @param {string|Function|RegExp|Array|object} [options.include]
 * @param {string|Function|RegExp|Array|object} [options.exclude]
 * @param {Function[]} configSetters 
 * @return {Function}
 */
function match(test, options, configSetters) {
  if (!configSetters && Array.isArray(options)) {
    configSetters = options;
    options = {};
  }

  configSetters = filterNotFunction(configSetters);

  const matcher = { test: createFileTypeMatcher(test) };

  if (options.exclude) {
    matcher.exclude = options.exclude;
  }
  if (options.include) {
    matcher.include = options.include;
  }

  const groupBlock = context => config => invokeConfigSetters(configSetters, deriveContextWithMatch(context, matcher), config);

  return Object.assign(groupBlock, {
    pre: context => invokePreHooks(configSetters, deriveContextWithMatch(context, matcher)),
    post: context => config => invokePostHooks(configSetters, deriveContextWithMatch(context, matcher), config)
  });
}

function getHooks(configSetters, type) {
  const hooks = configSetters
    .filter(setter => Boolean(setter[type]))
    .map(setter => setter[type]);

  const flattenedHooks = hooks
    .map(hook => (Array.isArray(hook) ? hook : [hook]))
    .reduce((allHooks, someHooks) => allHooks.concat(someHooks), []);

  return filterDuplicates(flattenedHooks);
}

function invokeConfigSetters(configSetters, context, baseConfig) {
  return configSetters.reduce(
    (config, setter) => {
      const updateFunction = setter(context, blockUtils);

      if (!isFunction(updateFunction)) {
        throw new Error(
          `Expected a function, instead got a ${typeof updateFunction}. Beware that the block API changed since version 0.x.
                    Dump of what should have been a function: ${JSON.stringify(updateFunction)}`
        );
      }

      return updateFunction(config);
    },
    baseConfig
  );
}

function invokePreHooks(configSetters, context) {
  const preHooks = getHooks(configSetters, 'pre');
  preHooks.forEach(hook => hook(context));
}

function invokePostHooks(configSetters, context, config) {
  const postHooks = getHooks(configSetters, 'post');
  return invokeConfigSetters(postHooks, context, config);
}

function createFileTypeMatcher(test) {
  const regexify = glob => globToRegex(glob, { extended: true });

  if (typeof test === 'string') {
    return regexify(test);
  } else if (Array.isArray(test) && test.every(item => typeof item === 'string')) {
    return test.map(item => regexify(item));
  }
  return test;
}

function deriveContextWithMatch(context, matcher) {
  return new Proxy(context, {
    has(target, propName) {
      return propName === 'match' ? true : (propName in target);
    },
    get(target, propName) {
      return propName === 'match' ? matcher : target[propName];
    }
  });
}

function filterDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

function filterNotFunction(arr) {
  return arr.filter(item => isFunction(item));
}
