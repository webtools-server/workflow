/**
 * main
 */

const path = require('path');
const webpack = require('@jyb/jfet-build-block-webpack3');
const less = require('@jyb/jfet-build-block-less');
const babel = require('@jyb/jfet-build-block-babel6');
const assets = require('@jyb/jfet-build-block-assets');
const extractText = require('@jyb/jfet-build-block-extract-text');

const { createConfig, entryPoint, setOutput, webpackCore, commonDoneHandler } = webpack;
const preset = {};

preset.run = (core, context) => {
    const { configuration, env } = context;
    const webpackConfig = createConfig(context, [
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
        core.match(['*.less'], [
            less(),
            extractText()
        ]),
        core.match(['*.gif', '*.jpg', '*.jpeg', '*.png', '*.webp'], [
            assets.file()
        ]),
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
