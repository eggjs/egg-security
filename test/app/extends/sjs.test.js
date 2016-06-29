'use strict';

require('should');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/app/extends/sjs.test.js', function() {
  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/helper-sjs-app',
      plugin: 'security',
    });
    this.app.ready(done);
  });

  after(mm.restore);


  describe('helper.sjs()', function() {
    it('should convert special chars on js context and not convert chart in whitelists', function(done) {
      request(this.app.callback())
        .get('/sjs')
        .expect(200)
        .expect('true', done);
    });

    it('should not convert when chars in whitelists', function(done) {
      request(this.app.callback())
        .get('/sjs-2')
        .expect(200)
        .expect('true', done);
    });

    it('should convert all special chars on js context except for special', function(done) {
      request(this.app.callback())
        .get('/sjs-3')
        .expect(200)
        .expect('true', done);
    });

    it('should only convert special chars plus /', function(done) {
      request(this.app.callback())
        .get('/sjs-4')
        .expect(200)
        .expect('true', done);
    });

  });

});
