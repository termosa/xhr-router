var createEvent = require('lib/create-event');

function triggerDOMEvent (node, name, options) {
  var event = createEvent(name, options);
  return node.dispatchEvent(event);
}
 
 module.exports = triggerDOMEvent;
