var location = require('device/location');
var urlWithoutOrigin = require('url/without-origin');
var routes = require('./routes');

var state = {};

function getUrl () {
  return urlWithoutOrigin(location.href);
}

function getState () { return state; }

function reloadState () {
  var url = getUrl();
  return state = {
    url: url,
    route: routes.find(url)
  };
}

function updateUrl () {
  state.url = getUrl();
}

module.exports = {
  get: getState,
  reload: reloadState,
  update: updateUrl
}
