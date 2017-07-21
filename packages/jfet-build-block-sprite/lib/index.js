/**
 * sprite webpack block.
 *
 * @see https://github.com/mixtur/webpack-spritesmith
 */

const SpritesmithPlugin = require('webpack-spritesmith');

/**
 * @param {object}   [options]
 * @return {Function}
 */
function sprite(options = {}) {
    return (context, util) => util.addPlugin(
        new SpritesmithPlugin(options)
    );
}

module.exports = sprite;
