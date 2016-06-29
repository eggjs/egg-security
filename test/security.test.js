'use strict';

require('should-http');
const mm = require('egg-mock');
const request = require('supertest');

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
      request(this.app.callback())
        .get('/')
        .set('accept', 'text/html')
        .expect('Strict-Transport-Security', 'max-age=31536000')
        .expect('X-Download-Options', 'noopen')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('X-XSS-Protection', '1; mode=block')
        .expect(200)
        .end(done);
    });

    it('should load default security headers when developer try to override in controller', function(done) {
      request(this.app3.callback())
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
      request(this.app4.callback())
        .get('/')
        .set('accept', 'text/html')
        .expect('Strict-Transport-Security', 'max-age=31536000')
        .expect('X-Download-Options', 'noopen')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect('X-XSS-Protection', '1; mode=block')
        .expect(200)
        .end(done);
    });

    it('should not load security headers when set to enable:false', function(done) {
      request(this.app2.callback())
        .get('/')
        .set('accept', 'text/html')
        .end(function(err, res) {
          const headers = JSON.stringify(res.headers);
          headers.indexOf('Strict-Transport-Security').should.equal(-1);
          done(err);
        });
    });
  });
});
