var router = require('module/router');
var onReady = require('lib/on-ready');
var routes = require('./routes');

function setupRoutes () {
  routes.forEach(function (route) {
    if (route[0]) {
      router.when(route[0], route[1], route[2]);
    } else {
      router.otherwise(route[1], route[2]);
    }
  });
}

function run (init) {
  onReady(function () {
    setupRoutes();
    if (typeof init === 'function') { init(); }
    router.start();
  });
}

module.exports = run;
