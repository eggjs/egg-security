'use strict';

require('should-http');
const should = require('should');
const mm = require('egg-mock');
const utils = require('..').utils;
const pedding = require('pedding');

describe('test/utils.test.js', function() {
  describe('utils.isSafeDomain', function() {
    before(function(done) {
      this.app = mm.app({
        baseDir: 'apps/isSafeDomain',
        plugin: 'security',
      });
      this.app.ready(done);
    });

    afterEach(mm.restore);
    const domainWhiteList = [ '.domain.com', '*.alibaba.com', 'http://www.baidu.com', '192.*.0.*' ];
    it('should return false when domains are not safe', function() {
      this.app.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect(200)
        .end(function(err, res) {
          res.text.should.equal('false');
        });
    });

    it('should return true when domains are safe', function() {
      this.app.httpRequest()
        .get('/safe')
        .set('accept', 'text/html')
        .expect(200)
        .end(function(err, res) {
          res.text.should.equal('true');
        });
    });

    it('should return true', function() {
      utils.isSafeDomain('domain.com', domainWhiteList).should.equal(true);
      utils.isSafeDomain('.domain.com', domainWhiteList).should.equal(true);
      utils.isSafeDomain('foo.domain.com', domainWhiteList).should.equal(true);
      utils.isSafeDomain('.foo.domain.com', domainWhiteList).should.equal(true);
      utils.isSafeDomain('.....domain.com', domainWhiteList).should.equal(true);
      utils.isSafeDomain('okokok----.domain.com', domainWhiteList).should.equal(true);

      // Wild Cast check
      utils.isSafeDomain('www.alibaba.com', domainWhiteList).should.equal(true);
      utils.isSafeDomain('www.tianmao.alibaba.com', domainWhiteList).should.equal(true);
      utils.isSafeDomain('www.tianmao.AlIBAba.COm', domainWhiteList).should.equal(true);
      utils.isSafeDomain('http://www.baidu.com', domainWhiteList).should.equal(true);
      utils.isSafeDomain('192.168.0.255', domainWhiteList).should.equal(true);
    });

    it('should return false', function() {
      utils.isSafeDomain('aaa-domain.com', domainWhiteList).should.equal(false);
      utils.isSafeDomain(' domain.com', domainWhiteList).should.equal(false);
      utils.isSafeDomain('pwd---.-domain.com', domainWhiteList).should.equal(false);
      utils.isSafeDomain('ok. domain.com', domainWhiteList).should.equal(false);

      // Wild Cast check
      utils.isSafeDomain('www.alibaba.com.cn', domainWhiteList).should.equal(false);
      utils.isSafeDomain('www.tianmao.alibab.com', domainWhiteList).should.equal(false);
      utils.isSafeDomain('http://www.baidu.com/zh-CN', domainWhiteList).should.equal(false);
      utils.isSafeDomain('192.168.1.255', domainWhiteList).should.equal(false);
    });
  });

  describe('utils.checkIfIgnore', function() {
    before(function* () {
      this.app = mm.app({
        baseDir: 'apps/utils-check-if-pass',
        plugin: 'security',
      });
      yield this.app.ready();

      this.app2 = mm.app({
        baseDir: 'apps/utils-check-if-pass2',
        plugin: 'security',
      });
      yield this.app2.ready();

      this.app3 = mm.app({
        baseDir: 'apps/utils-check-if-pass3',
        plugin: 'security',
      });
      yield this.app3.ready();

      this.app4 = mm.app({
        baseDir: 'apps/utils-check-if-pass4',
        plugin: 'security',
      });
      yield this.app4.ready();

      this.app5 = mm.app({
        baseDir: 'apps/utils-check-if-pass5',
        plugin: 'security',
      });
      yield this.app5.ready();

      this.app6 = mm.app({
        baseDir: 'apps/utils-check-if-pass6',
        plugin: 'security',
      });
      yield this.app6.ready();
    });

    afterEach(mm.restore);

    it('should use match', function(done) {
      this.app.httpRequest()
        .get('/match')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.headers['x-csp-nonce'].length.should.equal(16);
          done();
        });
    });

    it('global match should not work', function(done) {
      this.app.httpRequest()
        .get('/luckydrq')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.headers['x-csp-nonce'].length.should.equal(16);
          done();
        });
    });

    it('own match should replace global match', function(done) {
      const app2 = this.app2;
      app2.httpRequest()
        .get('/mymatch')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.headers['x-csp-nonce'].length.should.equal(16);
          app2.httpRequest()
            .get('/match')
            .expect(200, function(err, res) {
              should.not.exist(err);
              should.not.exist(res.headers['x-csp-nonce']);
              done();
            });
        });
    });

    it('own match has priority over own ignore', function(done) {
      this.app2.httpRequest()
        .get('/mytrueignore')
        .expect(200, function(err, res) {
          should.not.exist(err);
          should.not.exist(res.headers['x-csp-nonce']);
          done();
        });
    });

    it('should not use global ignore', function(done) {
      this.app3.httpRequest()
        .get('/ignore')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.headers['x-csp-nonce'].length.should.equal(16);
          done();
        });
    });

    it('own ignore should replace global ignore', function(done) {
      const app4 = this.app4;

      app4.httpRequest()
        .get('/ignore')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.headers['x-csp-nonce'].length.should.equal(16);
          app4.httpRequest()
            .get('/myignore')
            .expect(200, function(err, res) {
              should.not.exist(err);
              should.not.exist(res.headers['x-csp-nonce']);
              done();
            });
        });
    });

    it('should ignore array work', function(done) {
      done = pedding(3, done);
      const app5 = this.app5;

      app5.httpRequest()
        .get('/ignore1')
        .expect(200, function(err, res) {
          res.should.not.have.header('X-Frame-Options');
          should.not.exist(err);
          done();
        });

      app5.httpRequest()
        .get('/ignore2')
        .expect(200, function(err, res) {
          res.should.not.have.header('X-Frame-Options');
          should.not.exist(err);
          done();
        });

      app5.httpRequest()
        .get('/')
        .expect(200, function(err, res) {
          res.should.have.header('X-Frame-Options');
          should.not.exist(err);
          done();
        });
    });

    it('should match array work', function(done) {
      done = pedding(3, done);
      const app6 = this.app6;

      app6.httpRequest()
        .get('/match1')
        .expect(200, function(err, res) {
          res.should.have.header('X-Frame-Options');
          should.not.exist(err);
          done();
        });

      app6.httpRequest()
        .get('/match2')
        .expect(200, function(err, res) {
          res.should.have.header('X-Frame-Options');
          should.not.exist(err);
          done();
        });

      app6.httpRequest()
        .get('/')
        .expect(200, function(err, res) {
          res.should.not.have.header('X-Frame-Options');
          should.not.exist(err);
          done();
        });
    });
  });
});
