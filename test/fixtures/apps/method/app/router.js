'use strict';

const methods = require('methods');

module.exports = function(app) {
  methods.forEach(function(m){
    app.router[m] && app.router[m]('/', function *(){
      this.body = '123';
    });
  });
};
