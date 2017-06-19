'use strict';

const should = require('should');
const mm = require('egg-mock');

describe('test/csp.test.js', function() {

  before(function* () {
    this.app = mm.app({
      baseDir: 'apps/csp',
      plugin: 'security',
    });
    yield this.app.ready();
    this.app2 = mm.app({
      baseDir: 'apps/csp-ignore',
      plugin: 'security',
    });
    yield this.app2.ready();
    this.app3 = mm.app({
      baseDir: 'apps/csp-reportonly',
      plugin: 'security',
    });
    yield this.app3.ready();
    this.app4 = mm.app({
      baseDir: 'apps/csp-supportie',
      plugin: 'security',
    });
    yield this.app4.ready();
  });

  afterEach(mm.restore);

  describe('directives', function() {
    it('should support other directives when pattern match', function(done) {
      this.app.httpRequest()
        .get('/testcsp')
        .expect(200)
        .end(function(err, res) {
          const nonce = res.text;
          if (err) {
            return done(err);
          }
          const expectedHeader = 'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' *.domain.com www.google-analytics.com \'nonce-' + nonce + '\';style-src \'unsafe-inline\' *.domain.com;img-src \'self\' data: *.domain.com www.google-analytics.com;frame-ancestors \'self\';report-uri http://pointman.domain.com/csp?app=csp';
          const header = res.headers['content-security-policy'];
          header.should.equal(expectedHeader);
          done();
        });
    });

    it('should support with custom policy', function(done) {
      this.app.httpRequest()
        .get('/testcsp/custom')
        .expect(200)
        .end(function(err, res) {
          const nonce = res.text;
          if (err) {
            return done(err);
          }
          const expectedHeader = `script-src 'self' 'nonce-${nonce}';style-src 'unsafe-inline';img-src 'self';frame-ancestors 'self';report-uri http://pointman.domain.com/csp?app=csp`;
          const header = res.headers['content-security-policy'];
          header.should.equal(expectedHeader);
          done();
        });
    });

    it('should support dynamic disable', function(done) {
      this.app.httpRequest()
        .get('/testcsp/disable')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          should.not.exist(res.headers['content-security-policy']);
          done();
        });
    });

    it('should support IE', function(done) {
      this.app4.httpRequest()
        .get('/testcsp')
        .set('user-agent', 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Trident/4.0)')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          const nonce = res.text;
          const expectedHeader = 'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' *.domain.com www.google-analytics.com \'nonce-' + nonce + '\';style-src \'unsafe-inline\' *.domain.com;img-src \'self\' data: *.domain.com www.google-analytics.com;frame-ancestors \'self\';report-uri http://pointman.domain.com/csp?app=csp';
          const header = res.headers['x-content-security-policy'];
          header.should.equal(expectedHeader);
          done();
        });
    });

    it('should support report-uri', function(done) {
      this.app.httpRequest()
        .get('/testcsp')
        .expect(200)
        .end(function(err, res) {
          const headers = JSON.stringify(res.headers);
          headers.indexOf('report-uri http://pointman.domain.com/csp?app=csp').should.not.equal(-1);
          done(err);
        });
    });
  });

  describe('nonce', function() {
    it('should support nonce', function(done) {
      this.app.httpRequest()
        .get('/testcsp')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          const nonce = res.text;
          const header = res.headers['content-security-policy'];
          const re_nonce = /nonce-([^']+)/;
          header.match(re_nonce, function(_, match) {
            nonce.should.equal(match);
          });
          done();
        });
    });

    it('should have X-CSP-Nonce header', function(done) {
      this.app.httpRequest()
        .get('/testcsp')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          const nonce = res.text;
          res.headers['x-csp-nonce'].should.equal(nonce);
          done();
        });
    });
  });

  it('should ignore path', function(done) {
    this.app2.httpRequest()
      .get('/api/update')
      .expect(200, function(err, res) {
        should.not.exist(res.headers['x-csp-nonce']);
      })
      .end(done);
  });


  it('should not ignore path when do not match', function(done) {
    this.app2.httpRequest()
      .get('/testcsp')
      .expect(200, function(err, res) {
        should.exist(res.headers['x-csp-nonce']);
        done();
      });
  });

  it('should support report only when pattern match and report only config open', function(done) {
    this.app3.httpRequest()
      .get('/testcsp')
      .expect(200)
      .end(function(err, res) {
        const nonce = res.text;
        if (err) {
          return done(err);
        }
        const expectedHeader = 'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' *.domain.com www.google-analytics.com \'nonce-' + nonce + '\';style-src \'unsafe-inline\' *.domain.com;img-src \'self\' data: *.domain.com www.google-analytics.com;frame-ancestors \'self\';report-uri http://pointman.domain.com/csp?app=csp';
        //  console.log(res.headers);
        const header = res.headers['content-security-policy-report-only'];
        header.should.equal(expectedHeader);
        done();
      });
  });

  it('should support report only when pattern match and report only config open and support ie', function(done) {
    this.app3.httpRequest()
      .get('/testcsp2')
      .set('user-agent', 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Trident/4.0)')
      .expect(200)
      .end(function(err, res) {
        const nonce = res.text;
        if (err) {
          return done(err);
        }
        const expectedHeader = 'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' *.domain.com www.google-analytics.com \'nonce-' + nonce + '\';style-src \'unsafe-inline\' *.domain.com;img-src \'self\' data: *.domain.com www.google-analytics.com;frame-ancestors \'self\';report-uri http://pointman.domain.com/csp?app=csp';
        const header = res.headers['x-content-security-policy-report-only'];
        header.should.equal(expectedHeader);
        done();
      });
  });
});
