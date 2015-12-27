var location = require('device/location');
var document = require('device/document');
var absoluteUrl = require('url/absolute');

var noop = function () {};
var xhr;

function extractTitleAndBody (doc) {
  return [
    (doc.querySelector('title') || {}).textContent,
    doc.querySelector('body'),
    'runScripts'
  ];
}

function changePage (title, body, runScripts) {
  document.title = title;
  document.documentElement.replaceChild(body, document.body);
  // setAutofocusElement();
  // remove noscript tags
  // if (runScripts) executeScriptTags();
}

function createDocument (html) {
  doc = document.documentElement.cloneNode();
  doc.innerHTML = html;
  doc.head = doc.querySelector('head');
  doc.body = doc.querySelector('body');
  return doc;
}

function createProgressTracker (onprogress) {
  var progress = 0;
  return function (event) {
    if (event.lengthComputable) {
      progress = event.loaded / event.total * 100;
    } else {
      progress += (100 - progress) / 10;
    }
    onprogress(progress);
  };
}

function processResponse (xhr) {
  function clientOrServerError () {
    return xhr.status >= 400 && xhr.status < 600;
  }

  function validContent () {
    var contentType = xhr.getResponseHeader('Content-Type');
    var test = /^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/;
    return contentType && contentType.match(test);
  }

  if (!clientOrServerError() && validContent()) {
    return createDocument(xhr.responseText);
  }
}

function loadPage (url, opts) {
  xhr = new XMLHttpRequest;
  xhr.open('GET', url, true);

  xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
  if (opts.referer) {
    xhr.setRequestHeader('X-XHR-Referer', opts.referer);
  }

  xhr.onload = function () {
    var doc = processResponse(xhr);
    if (!doc) { return opts.onerror(); }

    changePage.apply(null, extractTitleAndBody(doc));

    opts.onload();
  };

  xhr.onprogress = createProgressTracker(opts.onprogress);

  xhr.onloadend = function () { xhr = null; };

  xhr.onerror = function () { opts.onerror(); }; // TODO: location.href = url;

  xhr.send();
}

function URLWithoutHash (url) {
  // Hash shouldn't be in AJAX request to keep compability with IE10
  var index = url.indexOf('#');
  if (index === -1) { return url; }
  return url.slice(index);
}

function applyOptions (options) {
  var opts = {};
  options = options || {};

  opts.referer = options.referer || location.href;

  if (typeof options.onload === 'function') {
    opts.onload = options.onload;
  } else {
    opts.onload = noop;
  }

  if (typeof options.onerror === 'function') {
    opts.onerror = options.onerror;
  } else {
    opts.onerror = noop;
  }

  if (typeof options.onprogress === 'function') {
    opts.onprogress = options.onprogress;
  } else {
    opts.onprogress = noop;
  }

  return opts;
}

function XHRPageLoader (url, options) {
  url = absoluteUrl(url);
  url = URLWithoutHash(url);
  if (xhr) {
    if (xhr.url === url && xhr.readyState !== 4) { return; }
    xhr.abort();
  }

  loadPage(url, applyOptions(options));
}

module.exports = XHRPageLoader;
