'use strict';

const methods = require('methods');

module.exports = function(app) {
  methods.forEach(function(m){
    app[m] && app[m]('/', function *(){
      this.body = '123';
    });

  })

};