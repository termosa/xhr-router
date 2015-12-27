var history = require('device/history');
var location = require('device/location');
var tick = require('lib/tick');
var isLinkChanged = require('url/is-link-changed');
var getHash = require('url/get-hash');
var urlWithoutOrigin = require('url/without-origin');
var routes = require('./routes');
var listen = require('./listener');
var dispatch = require('./dispatcher');
var state = require('./state');

function applyState (state, done) {
  // `done` is custom options so it can be ignored
  if (!state || !state.route) { return; }
  if (state.isStarted) { return; }

  var route = state.route;
  var loader = route.loader;
  var params = [state.url].concat(route.params);

  if (route.isAsync) { params = [done].concat(params); }
  state.cancel = loader.apply(null, params);
  if (!route.isAsync) { done(); }
}

function onPageUnload () {
  dispatch.beforeunload();
  var cancel = state.get().cancel;
  if (typeof cancel === 'function') { cancel(); }
  dispatch.unload();
}

function onPageChange () {
  applyState(state.reload(), onPageLoaded);
  dispatch.change();
}

function onPageLoaded () {
  tick(dispatch.loaded);
}

function onPageUpdate () {
  state.update();
  dispatch.update();
}

function startRouter () {
  listen.unload(onPageUnload);
  listen.change(onPageChange);
  listen.update(onPageUpdate);
}

function stopRouter () {
  listen.revoke();
}

function addRoute (validator, loader, isAsync) {
  routes.add(validator, loader, isAsync);
}

function addDefaultRoute (loader, isAsync) {
  routes.setDefault(loader, isAsync);
}

function silentVisit (url) {
  history.pushState(null, null, url);
}

function silentReplace (url) {
  history.replaceState(null, null, url);
}

function softVisit (url) {
  if (!isLinkChanged(state.get().url, url) && getHash(url)) {
    location.href = getHash(url);
  } else {
    tick(function () {
      onPageUnload();
      silentVisit(url);
      tick(onPageChange);
    });
  }
}

function softReplace (url) {
  if (!isLinkChanged(state.get().url, url) && getHash(url)) {
    location.replace(getHash(url));
  } else {
    tick(function () {
      onPageUnload();
      silentReplace(url);
      tick(onPageChange);
    });
  }
}

function visit (url, silent) {
  if (silent) { softVisit(url); }
  else { location.href = url; }
}

function replace (url, silent) {
  if (silent) { softReplace(url); }
  else { location.replace(url); }
}

function forward () {
  history.forward();
}

function back () {
  history.back();
}

module.exports = {
  // Options
  start: startRouter,
  stop: stopRouter,

  // Settings
  when: function (validator, loader, isAsync) {
    addRoute(validator, loader, isAsync);
    return this;
  },
  otherwise: function (loader, isAsync) {
    addDefaultRoute(loader, isAsync);
    return this;
  },

  // Navigation
  go: visit,
  replace: replace,
  forward: forward,
  back: back
};
