var absolute = require('url/absolute');

function withoutHash (url) {
  url = absolute(url);
  var index = url.indexOf('#');
  if (index === -1) return url;
  return url.slice(0, index);
}

module.exports = withoutHash;
