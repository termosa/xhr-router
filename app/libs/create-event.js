var window = require('device/window');
var document = require('device/document');

function createEventInOldWay (type, options) {
  options = options || {};
  var event = document.createEvent('Event');
  event.initEvent(type, options.bubbles, options.cancelable);
  for (var name in options) {
    if (name !== 'bubbles' && name !== 'cancelable') {
      event[name] = options[name];
    }
  }
  return event;
}

function createEvent (type, options) {
  return typeof window.CustomEvent === 'function'
    ? new window.CustomEvent(type, options)
    : createEventInOldWay(type, options);
}

module.exports = createEvent;
