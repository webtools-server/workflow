/* eslint-disable */
;(function() {
  // 常量
  var JFET_WEBP = '_jfet_webp';
  var SUPPORT = {
    YES: '1',
    NO: '0'
  };

  webpSupport(function(support) {
    var links = document.getElementsByTagName('link');
    [].forEach.call(links, function(link) {
        link.href = support ? link.getAttribute('data-href').replace('.css', '.webp.css') : link.getAttribute('data-href');
        link.removeAttribute('data-href');
    });
  });

  // 尝试加载webp图片
  function tryLoadImage(callback, isStorage) {
    var img = new Image();
    img.onload = img.onerror = function() {
      var support = img.height === 2;
      // 把判断结果存储下来
      if (isStorage) {
        window.localStorage.setItem(JFET_WEBP, support ? SUPPORT.YES : SUPPORT.NO);
      }
      callback(support);
    };
    img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  // 是否支持webp
  function webpSupport(callback) {
    if (typeof callback !== 'function') {
      callback = function() {}
    }

    try {
      // 获取之前判断结果
      var jfetWebp = window.localStorage.getItem(JFET_WEBP);
      if (jfetWebp) {
        callback(jfetWebp === SUPPORT.YES);
      } else {
        tryLoadImage(callback, true);
      }
    } catch (e) {
      tryLoadImage(callback, false);
    }
  }
})();
