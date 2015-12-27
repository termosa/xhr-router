var history = require('device/history');
var navigator = require('device/navigator');


module.exports = history // History object exists
  && (history.pushState && history.replaceState) // History object has requied methods
  && (typeof history.state !== "undefined" // History state is defined
    || navigator.userAgent.match /Firefox\/2[6|7]/) // Handle bug in Firefox 26/27 where `history.state` is initially `undefined`
