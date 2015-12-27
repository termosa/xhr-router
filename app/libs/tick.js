var window = require('device/window');
var slice = require('lib/slice-array');

function tick (func) {
  var args = slice(arguments, 1);
  window.setTimeout(function () {
    func.apply(this, args);
  }, 0);
}

function revoke (tickId) {
  window.clearTimeout(tickId);
}

tick.revoke = revoke;

module.exports = tick;
