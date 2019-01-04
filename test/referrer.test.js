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

    it('should throw error when Referrer-Policy settings is invalid when configured', function(done) {
      const policy = 'oorigin';
      this.app2.httpRequest()
        .get(`/referrer?policy=${policy}`)
        .set('accept', 'text/html')
        .expect(new RegExp(`"${policy}" is not available.`))
        .expect(500, done);
    });

    // check for fix https://github.com/eggjs/egg-security/pull/50
    it('should throw error when Referrer-Policy is set to index of item in ALLOWED_POLICIES_ENUM', function(done) {
      const policy = 0;
      this.app2.httpRequest()
        .get(`/referrer?policy=${policy}`)
        .set('accept', 'text/html')
        .expect(new RegExp(`"${policy}" is not available.`))
        .expect(500, done);
    });

  });
});
