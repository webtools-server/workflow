/**
 * main
 */

const path = require('path');
const autoprefixer = require('autoprefixer');
const ManifestPlugin = require('webpack-manifest-plugin');

const webpack = require('@jyb/jfet-build-block-webpack3');
const sass = require('@jyb/jfet-build-block-sass');
const less = require('@jyb/jfet-build-block-less');
const babel = require('@jyb/jfet-build-block-babel6');
const assets = require('@jyb/jfet-build-block-assets');
const dot = require('@jyb/jfet-build-block-dot');
const vue = require('@jyb/jfet-build-block-vue');
const assemble = require('@jyb/jfet-build-block-assemble');

const {
    // config
    createConfig,
    entryPoint,
    defineConstants,
    resolveAliases,
    setContext,
    setDevTool,
    scanEntry,
    setOutput,
    addPlugins,

    // plugin
    extractText,

    // webpack
    webpackCore,
    commonDoneHandler
} = webpack;
const preset = {};

preset.run = (core, context) => {
    const { configuration, env } = context;
    const isProduction = env !== 'watch';
    const jsFileName = isProduction ? 'js/[name].[hash:8].js' : 'js/[name].js';
    const cssFileName = isProduction ? 'css/[name].[hash:8].css' : 'css/[name].css';

    // plugin
    const plugins = [
        new webpackCore.LoaderOptionsPlugin({
            options: {
                context: __dirname,
                minimize: true,
                postcss: [
                    autoprefixer({
                        browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9'
                        ],
                    })
                ],
            },
        }),
        new ManifestPlugin(Object.assign({ // see https://www.npmjs.com/package/webpack-manifest-plugin
            fileName: 'mainfest.json'
        }, configuration.manifestPlugin))
    ];

    if (isProduction) {
        plugins.push(new webpackCore.optimize.UglifyJsPlugin(Object.assign({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            screwIe8: true,
            sourceMap: false
        }, configuration.uglifyJsPlugin)));
    }

    if (configuration.commonsChunkPlugin) {
        plugins.push(new webpackCore.optimize.CommonsChunkPlugin(Object.assign({
            name: 'vendor',
            filename: jsFileName,
        }, configuration.commonsChunkPlugin)));
    }

    // setter
    const configSetters = [
        scanEntry(Object.assign({ prefixFilter }, configuration.scanEntry)),
        entryPoint(configuration.entryPoint),
        setOutput(Object.assign({
            filename: jsFileName,
        }, configuration.setOutput)),
        defineConstants(configuration.defineConstants),
        resolveAliases(configuration.resolveAliases),
        setContext(configuration.setContext),
        setDevTool(configuration.setDevTool),
        babel(Object.assign({
            babelrc: false,
            presets: [
                require.resolve('babel-preset-es2015'),
                require.resolve('babel-preset-stage-0'),
            ],
            cacheDirectory: true
        }, configuration.babel)),
        dot(configuration.dot),
        vue(configuration.vue),
        assemble(configuration.assemble),
        core.match(['*.less'], [
            less(true, Object.assign({
                minimize: isProduction
            }, configuration.less)),
            extractText(configuration.extractText || cssFileName)
        ]),
        core.match(['*.scss'], [
            sass(true, Object.assign({
                minimize: isProduction
            }, configuration.sass)),
            extractText(configuration.extractText || cssFileName)
        ]),
        core.match(/\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i, [
            assets.url(Object.assign({
                name: 'image/[name].[hash:8].[ext]',
                limit: 10000
            }, configuration.image)),
            assets.image(configuration.imageLoader || {})
        ]),
        core.match(/\.svg(\?.*)?$/, [
            assets.url(Object.assign({
                name: 'image/[name].[hash:8].[ext]',
                minetype: 'image/svg+xml'
            }, configuration.svg))
        ]),
        core.match(/\.(woff|woff2|ttf|eot)(\?.*)?$/, [
            assets.file(Object.assign({
                name: 'font/[name].[hash:8].[ext]'
            }, configuration.font))
        ]),
        addPlugins(plugins)
    ];

    return new Promise((resolve) => {
        const compiler = webpackCore(createConfig(context, configSetters));
        const done = commonDoneHandler.bind(null, !isProduction, resolve);

        if (!isProduction) {
            compiler.watch(200, done);
        } else {
            compiler.run(done);
        }
    });
};

function prefixFilter(name) {
    const arrPath = path.dirname(name).split(path.sep);
    const ext = path.extname(name);
    const newName = arrPath.pop();

    if (ext === '.html') {
        return newName ? newName + ext : name;
    }

    return newName || name;
}

module.exports = preset;
