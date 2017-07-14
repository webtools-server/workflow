/**
 * main
 */

const path = require('path');
const autoprefixer = require('autoprefixer');
const ManifestPlugin = require('webpack-manifest-plugin');

const webpack = require('@jyb/jfet-build-block-webpack3');
const less = require('@jyb/jfet-build-block-less');
const babel = require('@jyb/jfet-build-block-babel6');
const assets = require('@jyb/jfet-build-block-assets');
const dot = require('@jyb/jfet-build-block-dot');

const {
    // config
    createConfig,
    entryPoint,
    scanEntry,
    setOutput,
    addPlugins,

    // plugin
    extractText,
    htmlPlugin,

    // webpack
    webpackCore,
    commonDoneHandler
} = webpack;
const preset = {};

function prefixFilter(name) {
    const arrPath = path.dirname(name).split(path.sep);
    const ext = path.extname(name);
    const newName = arrPath.pop();

    if (ext === '.html') {
        return newName ? newName + ext : name;
    }

    return newName || name;
}

preset.run = (core, context) => {
    const { configuration, env } = context;
    const webpackConfig = createConfig(context, [
        scanEntry({
            pattern: path.join(__dirname, '..', 'demo/development/pages/**/index.js'),
            prefixFilter
        }),
        entryPoint({
            home: path.join(__dirname, '..', 'demo/development/pages/home/index.js'),
            list: path.join(__dirname, '..', 'demo/development/pages/list/index.js')
        }),
        setOutput({
            filename: 'js/[name].[hash:8].js',
            path: path.join(__dirname, '..', 'demo/development/public')
        }),
        babel({
            babelrc: false,
            presets: [
                require.resolve('babel-preset-es2015'),
                require.resolve('babel-preset-stage-0'),
            ],
            cacheDirectory: true
        }),
        dot(),
        core.match(['*.less'], [
            less(true, {
                minimize: true
            }),
            extractText()
        ]),
        core.match(['*.gif', '*.jpg', '*.jpeg', '*.png', '*.webp'], [
            assets.file()
        ]),
        htmlPlugin({
            scan: {
                pattern: path.join(__dirname, '..', 'demo/development/pages/**/index.html'),
                prefixFilter
            },
            setConfig() {}
        }),
        addPlugins([
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
            new webpackCore.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                },
                screwIe8: true,
                sourceMap: false
            }),
            new ManifestPlugin({ // see https://www.npmjs.com/package/webpack-manifest-plugin
                fileName: 'mainfest.json',
                // basePath: 'public/',
                // publicPath: 'public_path'
                // stripSrc
            })
        ])
    ]);

    return new Promise((resolve) => {
        const compiler = webpackCore(webpackConfig);
        const done = commonDoneHandler.bind(null, env === 'watch', resolve);

        if (env === 'watch') {
            compiler.watch(200, done);
        } else {
            compiler.run(done);
        }
    });
};

module.exports = preset;
