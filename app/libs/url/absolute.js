var document = require('device/document');

var link = document.createElement('a');

function absoluteUrl (url) {
  link.href = url;
  return link.href;
}

module.exports = absoluteUrl;
