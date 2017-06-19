'use strict';

require('should');
const mm = require('egg-mock');

describe('test/app/extends/sjson.test.js', function() {
  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/helper-sjson-app',
      plugin: 'security',
    });
    this.app.ready(done);
  });

  after(mm.restore);

  describe('helper.sjson()', function() {
    it('should not convert json string when json is safe', function(done) {
      this.app.httpRequest()
        .get('/safejson')
        .expect(200)
        .expect('true', done);
    });

    it('should not convert json string when json is safe contains array', function(done) {
      this.app.httpRequest()
        .get('/safejsontc2')
        .expect(200)
        .expect('true', done);
    });
    it('should not convert json string when json is safe contains string', function(done) {
      this.app.httpRequest()
        .get('/safejsontc3')
        .expect(200)
        .expect('true', done);
    });
    it('should not convert json string when json is safe contains object', function(done) {
      this.app.httpRequest()
        .get('/safejsontc4')
        .expect(200)
        .expect('true', done);
    });
    it('should not convert json string when json is safe contains symbel', function(done) {
      this.app.httpRequest()
        .get('/safejsontc5')
        .expect(200)
        .expect('true', done);
    });
    it('should not convert json string when json is safe contains function', function(done) {
      this.app.httpRequest()
        .get('/safejsontc6')
        .expect(200)
        .expect('true', done);
    });
    it('should not convert json string when json is safe contains buffer', function(done) {
      this.app.httpRequest()
        .get('/safejsontc7')
        .expect(200)
        .expect('true', done);
    });
    it('should not convert json string when json is safe contains null', function(done) {
      this.app.httpRequest()
        .get('/safejsontc8')
        .expect(200)
        .expect('true', done);
    });
    it('should not convert json string when json is safe contains undefined', function(done) {
      this.app.httpRequest()
        .get('/safejsontc9')
        .expect(200)
        .expect('true', done);
    });
    it('should not convert json string when json is safe contains boolean', function(done) {
      this.app.httpRequest()
        .get('/safejsontc10')
        .expect(200)
        .expect('true', done);
    });


    it('should convert json string when json contains unsafe key or value', function(done) {
      this.app.httpRequest()
        .get('/unsafejson')
        .expect(200)
        .expect('true', done);
    });

    it('should convert json string when json contains unsafe value nested', function(done) {
      this.app.httpRequest()
        .get('/unsafejson2')
        .expect(200)
        .expect('true', done);
    });

    it('should convert json string when json contains unsafe value nested in array', function(done) {
      this.app.httpRequest()
        .get('/unsafejson3')
        .expect(200)
        .expect('true', done);
    });

    it('should convert json string when json contains unsafe key nested in array', function(done) {
      this.app.httpRequest()
        .get('/unsafejson4')
        .expect(200)
        .expect('true', done);
    });

    it('should convert json string when json contains unsafe key', function(done) {
      this.app.httpRequest()
        .get('/unsafejson5')
        .expect(200)
        .expect('true', done);
    });

  });

});
