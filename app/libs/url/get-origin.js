var document = require('device/document');

var link = document.createElement('a');

function getOrigin (url) {
  link.href = url;
  return link.origin;
}

module.exports = getOrigin;
