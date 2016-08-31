'use strict';

require('should-http');
const mm = require('egg-mock');
const request = require('supertest');

describe('test/hsts.test.js', function() {
  describe('server', function() {
    before(function* () {
      this.app = mm.app({
        baseDir: 'apps/hsts',
        plugin: 'security',
      });
      yield this.app.ready();
      this.app2 = mm.app({
        baseDir: 'apps/hsts-nosub',
        plugin: 'security',
      });
      yield this.app2.ready();
      this.app3 = mm.app({
        baseDir: 'apps/hsts-default',
        plugin: 'security',
      });
      yield this.app3.ready();
    });

    afterEach(mm.restore);

    it('should contain not Strict-Transport-Security header with default', function(done) {
      request(this.app3.callback())
        .get('/')
        .set('accept', 'text/html')
        .expect(200)
        .end(function(err, res) {
          const headers = JSON.stringify(res.headers);
          headers.indexOf('Strict-Transport-Security').should.equal(-1);
          done();
        });
    });

    it('should contain Strict-Transport-Security header when configured', function(done) {
      request(this.app2.callback())
        .get('/')
        .set('accept', 'text/html')
        .expect('Strict-Transport-Security', 'max-age=31536000')
        .expect(200)
        .end(done);
    });

    it('should contain includeSubdomains rule when defined', function(done) {
      request(this.app.callback())
        .get('/')
        .set('accept', 'text/html')
        .expect('Strict-Transport-Security', 'max-age=31536000; includeSubdomains')
        .expect(200)
        .end(done);
    });

    it('should not contain includeSubdomains rule with this.securityOptions', function(done) {
      request(this.app.callback())
        .get('/nosub')
        .set('accept', 'text/html')
        .expect('Strict-Transport-Security', 'max-age=31536000')
        .expect(200)
        .end(done);
    });
  });
});
