'use strict';

module.exports = function(app) {
  app.get('/testcsp', function*() {
    this.body = this.nonce;
  });
  app.get('/api/update', function*() {
    this.body = 456;
  });
};
