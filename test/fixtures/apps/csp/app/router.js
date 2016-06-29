'use strict';

module.exports = function(app) {
  app.get('/testcsp', function *(){
    this.body = this.nonce;
  });

  app.get('/testcsp/custom', function*() {
    this.securityOptions.csp = {
      policy: {
        'script-src': [
          '\'self\'',
        ],
        'style-src': [
          '\'unsafe-inline\'',
        ],
        'img-src': [
          '\'self\'',
        ],
        'frame-ancestors': [
          '\'self\'',
        ],
        'report-uri': 'http://pointman.domain.com/csp?app=csp',
      },
    };
    this.body = this.nonce;
  });

  app.get('/testcsp/disable', function*() {
    this.securityOptions.csp = {
      enable: false,
    };
    this.body = 'hello';
  });
};