var window = require('device/window');
var document = require('device/document');
var trigger = require('lib/trigger-dom-event');

var EVENT_TRANSITION = 'page:transition';

function dispatchTransition (url, causer) {
  var options = {
    cancelable: true,
    detail: { url: url, causer: causer }
  };
  return trigger(window, EVENT_TRANSITION, options);
}

function isGeneralMouseClick (event) {
  var isMessyClick = event.which > 1 ||
    event.metaKey || event.ctrlKey ||
    event.shiftKey || event.altKey;
  return !isMessyClick;
}

function handleTransition (event) {
  if (event.defaultPrevented) { return; }
  if (!isGeneralMouseClick(event)) { return; }

  var link = event.target;
  while (link.parentNode && link.nodeName !== 'A') {
    link = link.parentNode;
  }

  if (link.nodeName === 'A' && link.href.length !== 0 && link.target === '') {
    if (!dispatchTransition(link.href, link)) {
      event.preventDefault();
    }
  }
}

function installHandler (event) {
  if (!event.defaultPrevented) {
    document.removeEventListener('click', handleTransition, false);
    document.addEventListener('click', handleTransition, false);
  }
}

(function track () {
  document.addEventListener('click', installHandler, true);
})();

function trackTransition (callback, cancel) {
  if (cancel) {
    window.removeEventListener(EVENT_TRANSITION, callback, false);
  } else {
    window.addEventListener(EVENT_TRANSITION, callback, false);
  }
}

module.exports = trackTransition;
