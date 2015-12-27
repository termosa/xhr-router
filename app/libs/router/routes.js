var storage = [];
var defaultRoute = null;

function findRoute (url) {
  var match;
  var route = storage.find(function (route) {
    var regexp = new RegExp(route[0], 'g');
    return match = url.match(regexp);
  });

  if (!route) {
    if (!defaultRoute) { return null; }
    route = defaultRoute;
  }

  return {
    loader: route[1],
    isAsync: route[2],
    params: match || []
  };
}

module.exports = {
  find: findRoute,
  add: function (validator, loader, isAsync) {
    storage.push([validator, loader, isAsync]);
  },
  setDefault: function (loader, isAsync) {
    defaultRoute = [null, loader, isAsync];
  }
};
