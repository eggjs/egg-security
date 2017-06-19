'use strict';

require('should');
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
      this.app.httpRequest()
        .get('/safepath')
        .expect(200)
        .expect('true', done);
    });

    it('should return null when filepath is not safe(contains ..)', function(done) {
      this.app.httpRequest()
        .get('/unsafepath')
        .expect(200)
        .expect('true', done);
    });

    it('should return null when filepath is not safe(contains /)', function(done) {
      this.app.httpRequest()
        .get('/unsafepath2')
        .expect(200)
        .expect('true', done);
    });

    it('should decode first when filepath contains %', function(done) {
      this.app.httpRequest()
        .get('/unsafepath3')
        .expect(200)
        .expect('true', done);
    });

    it('should decode until filepath does not contains %', function(done) {
      this.app.httpRequest()
        .get('/unsafepath4')
        .expect(200)
        .expect('true', done);
    });

    it('should not affect function when filepath decoding failed', function(done) {
      this.app.httpRequest()
        .get('/unsafepath5')
        .expect(200)
        .expect('true', done);
    });

    it('should return source code when filepath argument is not a string', function(done) {
      this.app.httpRequest()
        .get('/unsafepath6')
        .expect(200)
        .expect('true', done);
    });

    it('should return source path when filepath contained % but judged to be safe', function(done) {
      this.app.httpRequest()
        .get('/unsafepath7')
        .expect(200)
        .expect('true', done);
    });

  });

});
