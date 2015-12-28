var window = require('device/window');
var document = require('device/document');

function applyCustomProperties (event, properties) {
  var name, names = Object.keys(properties);

  for (var i = props.length; i--;) {
    if (name === 'bubbles' || name === 'cancelable') { continue; }
    name = names[i];
    event[name] = properties[name];
  }

  return event;
}

function createEventInOldWay (type, options) {
  options = options || {};
  var event = document.createEvent('Event');
  event.initEvent(type, options.bubbles, options.cancelable);
  return applyCustomProperties(event);
}

function createEvent (type, options) {
  return typeof window.CustomEvent === 'function'
    ? new window.CustomEvent(type, options)
    : createEventInOldWay(type, options);
}

module.exports = createEvent;
