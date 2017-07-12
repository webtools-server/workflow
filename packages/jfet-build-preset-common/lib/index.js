/**
 * main
 */

const webpack = require('@jyb/jfet-build-block-webpack3');

const { createConfig, entryPoint } = webpack;
const preset = {};

preset.run = (core, context) => {
    const { configuration, env } = context;
    const webpackConfig = createConfig(core, [
        entryPoint({})
    ]);

    return new Promise((resolve, reject) => {

    });
};

module.exports = preset;
