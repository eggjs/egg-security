'use strict';

const methods = require('methods');

module.exports = function(app) {
  methods.forEach(function(m) {
    typeof app[m] === 'function' && app[m]('/', function*() {
      this.body = '123';
    });
  })
};
