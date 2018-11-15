'use strict';

require('should');
const mm = require('egg-mock');

describe('test/app/extends/helper.test.js', function() {
  before(function* () {
    this.app = mm.app({
      baseDir: 'apps/helper-app',
      plugin: 'security',
    });

    yield this.app.ready();

    this.app2 = mm.app({
      baseDir: 'apps/helper-config-app',
      plugin: 'security',
    });

    yield this.app2.ready();

    this.app3 = mm.app({
      baseDir: 'apps/helper-link-app',
      plugin: 'security',
    });

    yield this.app3.ready();

  });

  after(mm.restore);

  describe('helper.escape()', function() {
    it('should work', function(done) {
      this.app.httpRequest()
        .get('/escape')
        .expect(200)
        .expect('true', done);
    });
  });

  describe('helper.shtml()', function() {
    it('should basic usage work', function(done) {
      this.app.httpRequest()
        .get('/shtml-basic')
        .expect(200)
        .expect('true', done);
    });

    it('should escape tag not in default whitelist', function(done) {
      this.app.httpRequest()
        .get('/shtml-escape-tag-not-in-default-whitelist')
        .expect(200)
        .expect('true', done);
    });

    it('should support multiple filter', function(done) {
      this.app.httpRequest()
        .get('/shtml-multiple-filter')
        .expect(200)
        .expect('true', done);
    });

    it('should escape script', function(done) {
      this.app.httpRequest()
        .get('/shtml-escape-script')
        .expect(200)
        .expect('true', done);
    });

    it('should escape img onload', function(done) {
      this.app.httpRequest()
        .get('/shtml-escape-img-onload')
        .expect(200)
        .expect('true', done);
    });

    it('should escape hostname null', function(done) {
      this.app.httpRequest()
        .get('/shtml-escape-hostname-null')
        .expect(200)
        .expect('true', done);
    });

    it('should support configuration', function(done) {
      this.app2.httpRequest()
        .get('/shtml-configuration')
        .expect(200)
        .expect('true', done);
    });

    it('should ignore domains not in default domainList', function(done) {
      this.app.httpRequest()
        .get('/shtml-ignore-domains-not-in-default-domainList')
        .expect(200)
        .expect('true', done);
    });

    it('should ignore hash', function(done) {
      this.app3.httpRequest()
        .get('/shtml-ignore-hash')
        .expect(200)
        .expect('true', done);
    });


    it('should support extending domainList via config.helper.shtml.domainWhiteList', function(done) {
      this.app2.httpRequest()
        .get('/shtml-extending-domainList-via-config.helper.shtml.domainWhiteList')
        .expect(200)
        .expect('true', done);
    });

    it('should support absolute path', function(done) {
      this.app.httpRequest()
        .get('/shtml-absolute-path')
        .expect(200)
        .expect('true', done);
    });

    it('should stripe css url', function(done) {
      this.app2.httpRequest()
        .get('/shtml-stripe-css-url')
        .expect(200)
        .expect('true', done);
    });

    it('should customize whitelist via this.securityOptions.shtml', function(done) {
      this.app.httpRequest()
        .get('/shtml-custom-via-security-options')
        .expect(200)
        .expect('true', done);
    });

    it('should check securityOptions when call shtml directly', function() {
      const ctx = this.app.mockContext();
      ctx.helper.shtml('<div></div>').should.eql('<div></div>');
    });

  });

  describe('helper.sjs()', function() {
    it('should sjs(foo) work', function(done) {
      this.app.httpRequest()
        .get('/sjs')
        .expect(200)
        .expect('true', done);
    });

    it('should convert special chars on js context', function(done) {
      this.app.httpRequest()
        .get('/sjs-2')
        .expect(200)
        .expect('true', done);
    });
  });

});
