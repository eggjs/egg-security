'use strict';

const pedding = require('pedding');
const mm = require('egg-mock');

describe('test/safe_redirect.test.js', function() {
  let app,
    app2;
  before(function* () {
    app = mm.app({
      baseDir: 'apps/safe_redirect',
      plugin: 'security',
    });
    yield app.ready();
    app2 = mm.app({
      baseDir: 'apps/safe_redirect_noconfig',
      plugin: 'security',
    });
    yield app2.ready();
  });

  afterEach(mm.restore);

  it('should redirect to / when url is in white list', function(done) {

    app.httpRequest()
      .get('/safe_redirect?goto=http://domain.com')
      .expect(302)
      .expect('location', 'http://domain.com', done);
  });

  it('should redirect to / when white list is blank', function(done) {
    done = pedding(2, done);
    app2.httpRequest()
      .get('/safe_redirect?goto=http://domain.com')
      .expect(302)
      .expect('location', 'http://domain.com', done);

    app2.httpRequest()
      .get('/safe_redirect?goto=http://baidu.com')
      .expect(302)
      .expect('location', 'http://baidu.com', done);
  });

  it('should redirect to / when url is invaild', function(done) {
    app.mm(process.env, 'NODE_ENV', 'production');
    done = pedding(3, done);
    app.httpRequest()
      .get('/safe_redirect?goto=http://baidu.com')
      .expect(302)
      .expect('location', '/', done);

    app.httpRequest()
      .get('/safe_redirect?goto=' + encodeURIComponent('http://domain.com.baidu.com/domain.com'))
      .expect(302)
      .expect('location', '/', done);

    app.httpRequest()
      .get('/safe_redirect?goto=https://x.yahoo.com')
      .expect(302)
      .expect('location', '/', done);
  });

  it('should redirect to / when url is baidu.com', function(done) {
    app.mm(process.env, 'NODE_ENV', 'production');
    app.httpRequest()
      .get('/safe_redirect?goto=baidu.com')
      .expect(302)
      .expect('location', '/', done);
  });

  it('should redirect to not safe url throw error on not production', function(done) {
    app.mm(process.env, 'NODE_ENV', 'dev');
    app.httpRequest()
      .get('/safe_redirect?goto=http://baidu.com')
      .expect(/redirection is prohibited./)
      .expect(500, done);
  });

  it('should redirect path directly', function(done) {
    done = pedding(2, done);
    app.httpRequest()
      .get('/safe_redirect?goto=/')
      .expect(302)
      .expect('location', '/', done);

    app.httpRequest()
      .get('/safe_redirect?goto=/foo/bar/')
      .expect(302)
      .expect('location', '/foo/bar/', done);
  });

  describe('black and white urls', function() {
    const blackurls = [
      '//baidu.com',
      '///baidu.com/',
      'xxx://baidu.com',
      'ftp://baidu.com/',
      'http://www.baidu.com?',
      'http://www.baidu.com#',
      'http://www.baidu.com%3F',
      'http://www.domain.com@www.baidu.com',
      '//www.domain.com',
      '////////www.domain.com',
      'http://hackdomain.com',
      'http://domain.com.fish.com',
      'http://www.domain.com.fish.com',
      '',
      '    ',
      '//foo',
      'http://baidu.com/123123\r\nHEADER',
      '',
      'http:///123',
    ];

    const whiteurls = [
      'http://domain.com',
    ];

    it('should block', function(done) {
      app.mm(process.env, 'NODE_ENV', 'production');
      done = pedding(blackurls.length, done);

      blackurls.forEach(function(url) {
        app.httpRequest()
          .get('/safe_redirect?goto=' + encodeURIComponent(url))
          .expect('location', '/')
          .expect(302, done);
      });
    });

    it('should block evil path', function() {
      app.mm(process.env, 'NODE_ENV', 'production');

      return app.httpRequest()
        .get('/safe_redirect?goto=' + encodeURIComponent('/\\evil.com/'))
        .expect('location', '/')
        .expect(302);
    });

    it('should pass', function(done) {
      done = pedding(whiteurls.length, done);

      whiteurls.forEach(function(url) {
        app.httpRequest()
          .get('/safe_redirect?goto=' + encodeURIComponent(url))
          .expect('location', url)
          .expect(302, done);
      });
    });
  });

  describe('unsafeRedirect()', function() {
    it('should redirect to unsafe url', function(done) {
      const urls = [
        'http://baidu.com',
        'http://xxx.oo.com/123.html',
      ];
      done = pedding(urls.length, done);

      urls.forEach(function(url) {
        app.httpRequest()
          .get('/unsafe_redirect?goto=' + encodeURIComponent(url))
          .expect(302)
          .expect('location', url, done);
      });
    });
  });
});
