'use strict';

module.exports = function(app) {
  app.get('/testcsp', function*() {
    this.body = this.nonce;
  });
};
