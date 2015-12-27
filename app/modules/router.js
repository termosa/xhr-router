var router = require('lib/router');
var slice = require('lib/slice-array');
var XHRPageLoader = require('lib/xhr-page-loader');

function createXHRLoader (loader) {
  return function (done, url) {
    var args = slice(arguments, 1);
    XHRPageLoader(url, {
      onload: function () {
        loader.apply(null, args);
        done();
      },
      onerror: function () { router.replace(url, 'force'); }
    });
  };
}

module.exports = {
  start: router.start,
  stop: router.stop,
  when: function (validator, loader, virtual) {
    if (virtual) { router.when(validator, loader, 'async'); }
    else { router.when(validator, createXHRLoader(loader), 'async'); }
    return this;
  },
  otherwise: function (loader, virtual) {
    if (virtual) { router.otherwise(loader, 'async'); }
    else { router.otherwise(createXHRLoader(loader), 'async'); }
    return this;
  },
  go: function (url, force) {
    router.go(url, !force);
  },
  replace: function (url, force) {
    router.replace(url, !force);
  },
  forward: router.forward,
  back: router.back
};
