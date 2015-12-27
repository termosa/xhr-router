var window = require('device/window');
var triggerDOMEvent = require('lib/trigger-dom-event');

var EVENT_TARGET = window;
var EVENT_SUFFIX = 'page:';
var EVENT_BEFORE_UNLOAD = EVENT_SUFFIX + 'beforeunload';
var EVENT_UNLOAD = EVENT_SUFFIX + 'unload';
var EVENT_CHANGE = EVENT_SUFFIX + 'change';
var EVENT_LOADED = EVENT_SUFFIX + 'loaded';
var EVENT_UPDATE = EVENT_SUFFIX + 'update';

function dispatch (name) {
  return triggerDOMEvent(EVENT_TARGET, name);
}

function createDispatcher (name) {
  return dispatch.bind(null, name);
}

module.exports = {
  EVENT: {
    BEFORE_UNLOAD: EVENT_BEFORE_UNLOAD,
    UNLOAD: EVENT_UNLOAD,
    CHANGE: EVENT_CHANGE,
    LOADED: EVENT_LOADED,
    UPDATE: EVENT_UPDATE
  },
  beforeunload: createDispatcher(EVENT_BEFORE_UNLOAD),
  unload: createDispatcher(EVENT_UNLOAD),
  change: createDispatcher(EVENT_CHANGE),
  loaded: createDispatcher(EVENT_LOADED),
  update: createDispatcher(EVENT_UPDATE)
};
