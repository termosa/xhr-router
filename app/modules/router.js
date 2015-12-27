var location = require('device/location');
var router = require('lib/router');
var slice = require('lib/slice-array');
var XHRPageLoader = require('lib/xhr-page-loader');
var captureTransition = require('lib/capture-transition');
var getOrigin = require('url/get-origin');

function createXHRLoader (loader) {
  return function (done, url) {
    var args = slice(arguments, 1);
    XHRPageLoader(url, {
      onload: function () {
        loader.apply(null, args);
        done();
      },
      onerror: function () {
        replace(url, 'force');
      }
    });
  };
}

function visit (url, force) {
  router.go(url, !force);
}

function replace (url, force) {
  router.replace(url, !force);
}

function onTransition (e) {
  var detail = e.detail;
  var url = detail && detail.url;
  if (!url) { return; }

  var siteOrigin = getOrigin(location.href);
  if (siteOrigin !== getOrigin(url)) { return; }

  var causer = detail.causer;
  if (causer) {
    if (causer.hasAttribute('data-static-resource')) { return; }
  }

  e.preventDefault();
  visit(url);
}

function startRouting () {
  router.start();
  captureTransition(onTransition);
}

function stopRouting () {
  captureTransition(onTransition, 'cancel');
  router.stop();
}

module.exports = {
  start: startRouting,
  stop: stopRouting,
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
  go: visit,
  replace: replace,
  forward: router.forward,
  back: router.back
};
