'use strict';

require('should-http');
const mm = require('egg-mock');

describe('test/referrer.test.js', function() {

  describe('server', function() {
    before(function* () {
      this.app = mm.app({
        baseDir: 'apps/referrer',
        plugin: 'security',
      });
      yield this.app.ready();
      this.app2 = mm.app({
        baseDir: 'apps/referrer-config',
        plugin: 'security',
      });
      yield this.app2.ready();
    });

    afterEach(mm.restore);

    it('should return default referrer-policy http header', function(done) {
      this.app.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('Referrer-Policy', 'no-referrer-when-downgrade')
        .expect(200, done);
    });

    it('should contain Referrer-Policy header when configured', function(done) {
      this.app2.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('Referrer-Policy', 'origin')
        .expect(200, done);
    });

  });
});
