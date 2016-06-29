'use strict';

require('should-http');
const mm = require('egg-mock');
const request = require('supertest');
const assert = require('assert');

describe('test/nosniff.test.js', function() {

  describe('server', function() {
    before(function(done) {
      this.app = mm.app({
        baseDir: 'apps/nosniff',
        plugin: 'security',
      });
      this.app.ready(done);
    });

    afterEach(mm.restore);

    it('should return default no-sniff http header', function(done) {
      request(this.app.callback())
        .get('/')
        .set('accept', 'text/html')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect(200, done);
    });

    it('should not return download noopen http header', function(done) {
      request(this.app.callback())
        .get('/disable')
        .set('accept', 'text/html')
        .expect(res => assert(!res.headers['x-content-type-options']))
        .expect(200, done);
    });

  });
});
