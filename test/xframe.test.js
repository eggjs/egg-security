'use strict';

const should = require('should');
const mm = require('egg-mock');
const pedding = require('pedding');
require('should-http');

describe('test/xframe.test.js', function() {

  describe('server', function() {
    before(function* () {
      this.app = mm.app({
        baseDir: 'apps/iframe',
        plugin: 'security',
      });
      yield this.app.ready();

      this.app2 = mm.app({
        baseDir: 'apps/iframe-novalue',
        plugin: 'security',
      });
      yield this.app2.ready();

      this.app3 = mm.app({
        baseDir: 'apps/iframe-allowfrom',
        plugin: 'security',
      });
      yield this.app3.ready();

      this.app4 = mm.app({
        baseDir: 'apps/iframe-black-urls',
        plugin: 'security',
      });
      yield this.app4.ready();
    });

    afterEach(mm.restore);

    it('should contain X-Frame-Options: SAMEORIGIN', function(done) {
      done = pedding(2, done);

      this.app.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('X-Frame-Options', 'SAMEORIGIN', done);

      this.app.httpRequest()
        .get('/foo')
        .set('accept', 'text/html')
        .expect('X-Frame-Options', 'SAMEORIGIN', done);
    });

    it('should contain X-Frame-Options: ALLOW-FROM http://www.domain.com by this.securityOptions', function(done) {
      this.app.httpRequest()
        .get('/options')
        .set('accept', 'text/html')
        .expect('X-Frame-Options', 'ALLOW-FROM http://www.domain.com', done);
    });

    it('should contain X-Frame-Options: SAMEORIGIN when dont set value option', function(done) {
      this.app2.httpRequest()
        .get('/foo')
        .set('accept', 'text/html')
        .expect('X-Frame-Options', 'SAMEORIGIN', done);
    });

    it('should contain X-Frame-Options: ALLOW-FROM with page when set ALLOW-FROM and page option', function(done) {
      this.app3.httpRequest()
        .get('/foo')
        .set('accept', 'text/html')
        .expect('X-Frame-Options', 'ALLOW-FROM http://www.domain.com', done);
    });

    it('should not contain X-Frame-Options: SAMEORIGIN when use ignore', function(done) {
      done = pedding(7, done);

      this.app.httpRequest()
        .get('/hello')
        .set('accept', 'text/html')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.should.not.have.header('X-Frame-Options');
          done();
        });

      this.app4.httpRequest()
        .get('/hello')
        .set('accept', 'text/html')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.should.not.have.header('X-Frame-Options');
          done();
        });

      this.app.httpRequest()
        .get('/world/12')
        .set('accept', 'text/html')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.should.not.have.header('X-Frame-Options');
          done();
        });

      this.app.httpRequest()
        .get('/world/12?xx=xx')
        .set('accept', 'text/html')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.should.not.have.header('X-Frame-Options');
          done();
        });

      this.app2.httpRequest()
        .get('/hello')
        .set('accept', 'text/html')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.should.not.have.header('X-Frame-Options');
          done();
        });

      this.app2.httpRequest()
        .get('/world/12')
        .set('accept', 'text/html')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.should.not.have.header('X-Frame-Options');
          done();
        });

      this.app2.httpRequest()
        .get('/world/12?xx=xx')
        .set('accept', 'text/html')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.should.not.have.header('X-Frame-Options');
          done();
        });
    });
  });

});
