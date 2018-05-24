/**
 * jfet config
 */

module.exports = {
  image() {
    return {
      webp: {
        img: {
          pattern: './public/image/*.{jpg,png,jpeg}',
          output: './public/image'
        },
        css: {
          pattern: './public/css/!(*.webp).css',
          output: './public/css'
        },
        tpl: {
          pattern: './public/pages/*.html',
          output: './public/pages_webp'
        },
        webpOptions: {}
      }
    };
  }
};
