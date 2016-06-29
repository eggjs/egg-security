'use strict';

require('should');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/app/extends/cliFilter.test.js', function() {
  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/helper-cliFilter-app',
      plugin: 'security',
    });
    this.app.ready(done);
  });

  after(mm.restore);


  describe('helper.cliFilter()', function() {
    it('should convert special chars in param and not convert chars in whitelists', function(done) {
      request(this.app.callback())
        .get('/cliFilter')
        .expect(200)
        .expect('true', done);
    });

    it('should not convert when chars in whitelists', function(done) {
      request(this.app.callback())
        .get('/cliFilter-2')
        .expect(200)
        .expect('true', done);
    });

  });

});
