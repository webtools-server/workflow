/* eslint-disable */
;(function() {
  webpSupport(function(support) {
    var links = document.getElementsByTagName('link');
    [].forEach.call(links, function(link) {
        link.href = support ? link.getAttribute('data-href').replace('.css', '.webp.css') : link.getAttribute('data-href');
    });
  });

  function webpSupport(callback) {
    if (typeof callback !== 'function') {
      callback = function() {}
    }

    try {
      var jfetWebp = window.localStorage.getItem('_jfet_webp');
      if (typeof jfetWebp === undefined) {

      }
    } catch (e) {

    }

    function tryLoadImage() {
      var f = new Image();
      f.onload = f.onerror = function() {
        if (f.height != 2) {
          if (c != undefined) {
            c._tmtwebp = 0
          }
          a();
          return false
        } else {
          if (c != undefined) {
            c._tmtwebp = 1
          }
          a(1);
          return true
        }
      };
      f.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
    }


    if (c != undefined && c._tmtwebp != undefined && c._tmtwebp == 0) {
      callback();
      return false;
    } else {
      if (c != undefined && c._tmtwebp != undefined && c._tmtwebp == 1) {
        callback(1);
        return true
      } else {

      }
    }
  }
})();
