var window = require('device/window');

function sliceArray (array, index, toIndex) {
  return window.Array.prototype.slice.call(array, index, toIndex);
}

module.exports = sliceArray;
