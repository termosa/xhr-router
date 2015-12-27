var window = require('device/window');
var onReady = require('lib/on-ready');
var isLinkChanged = require('url/is-link-changed');
var state = require('./state');

function getLastUrl () { return state.get().url; }
function updateLastUrl () { state.update(); }
function getUrl () { return location.href; }

var noop = function () {};
var unloadCallback = noop;
var changeCallback = noop;
var updateCallback = noop;
var isSubscribed = false;

function onUnload () {
  unloadCallback();
  updateLastUrl();
}
function onChange () {
  changeCallback();
}
function onPopstate () {
  if (!isLinkChanged(getLastUrl(), getUrl())) {
    updateLastUrl();
    updateCallback();
  } else {
    onUnload();
    onChange();
  }
}

function subscribe () {
  if (isSubscribed) { return; }
  isSubscribed = true;
  window.addEventListener('beforeunload', onUnload, true);
  window.addEventListener('popstate', onPopstate, true);
  onReady(onChange);
}

function unsubscribe () {
  if (!isSubscribed) { return; }
  isSubscribed = false;
  window.removeEventListener('beforeunload', onUnload, true);
  window.removeEventListener('popstate', onPopstate, true);
  onReady(onChange, 'cancel');
}

module.exports = {
  revoke: function () {
    unsubscribe();
    unloadCallback = noop;
    changeCallback = noop;
    updateCallback = noop;
  },
  unload: function (callback) { // Before page change
    if (typeof callback !== 'function') { return; }
    unloadCallback = callback;
    subscribe();
  },
  change: function (callback) { // On page change
    if (typeof callback !== 'function') { return; }
    changeCallback = callback;
    subscribe();
  },
  update: function (callback) { // On hash change
    if (typeof callback !== 'function') { return; }
    updateCallback = callback;
    subscribe();
  }
};
