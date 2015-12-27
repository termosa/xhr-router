var urlWithoutHash = require('url/without-hash');
var getHash = require('url/get-hash');

function isLinkChanged (url, nextUrl) {
  if (urlWithoutHash(url) !== urlWithoutHash(nextUrl)) { return true; }
  if (getHash(url) && !getHash(nextUrl)) { return true; }
  return false;
}

module.exports = isLinkChanged;
