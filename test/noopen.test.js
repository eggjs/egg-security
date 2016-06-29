'use strict';

require('should-http');
const mm = require('egg-mock');
const request = require('supertest');
const assert = require('assert');

describe('test/noopen.test.js', function() {

  describe('server', function() {
    before(function(done) {
      this.app = mm.app({
        baseDir: 'apps/noopen',
        plugin: 'security',
      });
      this.app.ready(done);
    });

    afterEach(mm.restore);

    it('should return default download noopen http header', function(done) {
      request(this.app.callback())
        .get('/')
        .set('accept', 'text/html')
        .expect('X-Download-Options', 'noopen')
        .expect(200, done);
    });

    it('should not return download noopen http header', function(done) {
      request(this.app.callback())
        .get('/disable')
        .set('accept', 'text/html')
        .expect(res => assert(!res.headers['x-download-options']))
        .expect(200, done);
    });

  });
});
