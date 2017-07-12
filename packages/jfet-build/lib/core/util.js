/**
 * 工具库
 */

const omitBy = require('lodash.omitby');
const webpackMerge = require('webpack-merge');

function merge(configSnippet) {
    return prevConfig => webpackMerge.smart(prevConfig, configSnippet);
}

function addLoader(loaderDef) {
    const cleanedLoaderDef = omitBy(loaderDef, v => typeof v === 'undefined');
    return prevConfig => webpackMerge.smart(prevConfig, {
        module: {
            rules: [cleanedLoaderDef]
        }
    });
}

function addPlugin(plugin) {
    return prevConfig => Object.assign({},
        prevConfig, { plugins: prevConfig.plugins.concat([plugin]) }
    );
}

module.exports = {
    merge,
    addLoader,
    addPlugin
};
