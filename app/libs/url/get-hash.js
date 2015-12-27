function getHash (url) {
  var index = url.indexOf('#');
  if (index === -1) return;
  return url.slice(index);
}

module.exports = getHash;
