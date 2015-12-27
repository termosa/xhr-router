var tick = require('lib/tick');

var store = [];

function timer (callback) {
  return tick(function () {
    tickStore.remove(callback);
    callback();
  });
}

var tickStore = {
  add: function (callback) {
    store.push([timer(callback), callback]);
  },
  remove: function (callback) {
    var index = store.findIndex(function (item) {
      return item[1] === callback;
    });

    if (index === -1) { return; }
    tick.revoke(store[index][0]);
    store.splice(index, 1);
  }
}

module.exports = tickStore;
