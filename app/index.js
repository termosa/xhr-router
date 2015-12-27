var window = require('device/window');

require('module/app')(function () {
  window.router = require('module/router');
  window.page = require('lib/xhr-page-loader');
});
