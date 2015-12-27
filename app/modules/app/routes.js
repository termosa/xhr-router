var document = require('device/document');

function getPageName () {
  return document.querySelector('h1').textContent;
}

module.exports = [
  [ 'index.html',
    function () {
      console.log('for home:', getPageName());
    }
  ],
  [ 'about.html',
    function () {
      console.log('for about:', getPageName());
    }
  ],
  [ null,
    function () {
      console.log('just any other page:', getPageName());
    }
  ]
];
