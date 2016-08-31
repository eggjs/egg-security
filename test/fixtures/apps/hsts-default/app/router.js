'use strict';

module.exports = function(app) {
  app.get('/', function* () {
    this.body = '123';
  });
  app.get('/nosub', function* () {
    this.securityOptions.hsts = {
      includeSubdomains: false,
    }
    this.body = '123';
  });
};