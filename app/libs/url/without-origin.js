var absolute = require('url/absolute');
var getOrigin = require('url/get-origin');

function withoutOrigin (url) {
  url = absolute(url);
  return url.slice(getOrigin(url).length);
}

module.exports = withoutOrigin;
