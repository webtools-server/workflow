/**
 * image
 */

/**
 * @param {object} [options]
 * @return {Function}
 * @see https://github.com/tcoopman/image-webpack-loader
 */
function image(options = {}) {
  const defaultOptions = {
    optipng: {
      optimizationLevel: 7
    },
    mozjpeg: {
      quality: 65
    },
    pngquant: {
      quality: '65-90',
      speed: 4
    }
  };

  return (context, util) => {
    if (!context.match) {
      throw new Error(
        'The image() block can only be used in combination with match(). ' +
        'Use match() to state on which files to apply the file loader.'
      );
    }

    return util.addLoader(
      Object.assign(
        {
          use: [{
            loader: require.resolve('image-webpack-loader'),
            options: Object.assign({}, defaultOptions, options)
          }]
        },
        context.match
      )
    );
  };
}

module.exports = image;
