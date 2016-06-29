'use strict';

require('should-http');
const mm = require('egg-mock');
const request = require('supertest');

describe('test/xss.test.js', function() {

  describe('server', function() {
    before(function* () {
      this.app = mm.app({
        baseDir: 'apps/xss',
        plugin: 'security',
      });
      yield this.app.ready();

      this.app2 = mm.app({
        baseDir: 'apps/xss-close',
        plugin: 'security',
      });
      yield this.app2.ready();

      this.app3 = mm.app({
        baseDir: 'apps/xss-close-zero',
        plugin: 'security',
      });
      yield this.app3.ready();

    });

    afterEach(mm.restore);

    it('should contain default X-XSS-Protection header', function(done) {
      request(this.app.callback())
        .get('/')
        .set('accept', 'text/html')
        .expect('X-XSS-Protection', '1; mode=block')
        .expect(200, done);
    });
    it('should set X-XSS-Protection header value 0 by this.securityOptions', function(done) {
      request(this.app.callback())
        .get('/0')
        .set('accept', 'text/html')
        .expect('X-XSS-Protection', '0')
        .expect(200, done);
    });
    it('should set X-XSS-Protection header value 0', function(done) {
      request(this.app2.callback())
        .get('/')
        .set('accept', 'text/html')
        .expect('X-XSS-Protection', '0')
        .expect(200, done);
    });
    it('should set X-XSS-Protection header value 0 when config is number 0', function(done) {
      request(this.app3.callback())
        .get('/')
        .set('accept', 'text/html')
        .expect('X-XSS-Protection', '0')
        .expect(200, done);
    });
  });
});
