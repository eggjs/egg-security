'use strict';

require('should');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/app/extends/spath.test.js', function() {
  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/helper-spath-app',
      plugin: 'security',
    });
    this.app.ready(done);
  });

  after(mm.restore);

  describe('helper.spath()', function() {
    it('should pass when filepath is safe', function(done) {
      request(this.app.callback())
        .get('/safepath')
        .expect(200)
        .expect('true', done);
    });

    it('should return null when filepath is not safe(contains ..)', function(done) {
      request(this.app.callback())
        .get('/unsafepath')
        .expect(200)
        .expect('true', done);
    });

    it('should return null when filepath is not safe(contains /)', function(done) {
      request(this.app.callback())
        .get('/unsafepath2')
        .expect(200)
        .expect('true', done);
    });

    it('should decode first when filepath contains %', function(done) {
      request(this.app.callback())
        .get('/unsafepath3')
        .expect(200)
        .expect('true', done);
    });

    it('should decode until filepath does not contains %', function(done) {
      request(this.app.callback())
        .get('/unsafepath4')
        .expect(200)
        .expect('true', done);
    });

    it('should not affect function when filepath decoding failed', function(done) {
      request(this.app.callback())
        .get('/unsafepath5')
        .expect(200)
        .expect('true', done);
    });

    it('should return source code when filepath argument is not a string', function(done) {
      request(this.app.callback())
        .get('/unsafepath6')
        .expect(200)
        .expect('true', done);
    });

    it('should return source path when filepath contained % but judged to be safe', function(done) {
      request(this.app.callback())
        .get('/unsafepath7')
        .expect(200)
        .expect('true', done);
    });

  });

});
