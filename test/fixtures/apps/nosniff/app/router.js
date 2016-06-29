'use strict';

module.exports = function(app) {
  app.get('/', function *(){
    this.body = '123';
  });

  app.get('/disable', function *(){
    this.securityOptions.nosniff = { enable: false };
    this.body = '123';
  });
};