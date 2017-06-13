'use strict';

require('should-http');
const mm = require('egg-mock');
const assert = require('assert');

describe('test/security.test.js', function() {

  describe('server', function() {
    before(function* () {
      this.app = mm.app({
        baseDir: 'apps/security',
        plugin: 'security',
      });
      yield this.app.ready();
      this.app2 = mm.app({
        baseDir: 'apps/security-unset',
        plugin: 'security',
      });
      yield this.app2.ready();
      this.app3 = mm.app({
        baseDir: 'apps/security-override-controller',
        plugin: 'security',
      });
      yield this.app3.ready();
      this.app4 = mm.app({
        baseDir: 'apps/security-override-middleware',
        plugin: 'security',
      });
      yield this.app4.ready();
    });

    afterEach(mm.restore);

    it('should load default security headers', function(done) {
      this.app.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('X-Download-Options', 'noopen')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('X-XSS-Protection', '1; mode=block')
        .expect(200)
        .end(done);
    });

    it('should load default security headers when developer try to override in controller', function(done) {
      this.app3.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('Strict-Transport-Security', 'max-age=31536000')
        .expect('X-Download-Options', 'noopen')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('X-XSS-Protection', '1; mode=block')
        .expect(200)
        .end(done);
    });

    it('should load default security headers when developer try to override in middleware', function(done) {
      this.app4.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('Strict-Transport-Security', 'max-age=31536000')
        .expect('X-Download-Options', 'noopen')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('X-XSS-Protection', '1; mode=block')
        .expect(200)
        .end(done);
    });

    it('disable hsts for default', function(done) {
      this.app2.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .end(function(err, res) {
          assert(!res.headers['strict-transport-security']);
          done(err);
        });
    });

    it('should not load security headers when set to enable:false', function(done) {
      this.app2.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .end(function(err, res) {
          assert(!res.headers['X-Frame-Options']);
          done(err);
        });
    });
  });
});
