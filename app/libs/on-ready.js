var document = require('device/document');
var tick = require('lib/tick');

var EVENT_LOAD = 'DOMContentLoaded';

var isReady = false;
var stack = [];

function revoke (canceledCallback) {
  var index = stack.findIndex(function (callback) {
    return callback === canceledCallback;
  });

  if (index !== -1) { stack.splice(index, 1); }
}

function observe () {
  if (!isReady) return;
  if (stack.length === 0) return;
  var callback;
  while (callback = stack.shift()) {
    callback();
  }
}

function onReady (callback, cancel) {
  if (typeof callback === 'function') {
    if (cancel) {
      revoke(callback);
    } else {
      stack.push(callback);
    }
  }
  tick(observe);
}

function onDOMContentLoaded () {
  isReady = true;
  document.removeEventListener(EVENT_LOAD, onDOMContentLoaded);
  tick(observe);
}

(function wait () {
  if (document.readyState !== 'loading') {
    isReady = true;
  } else {
    document.addEventListener(EVENT_LOAD, onDOMContentLoaded, true);
  }
})();

module.exports = onReady;
