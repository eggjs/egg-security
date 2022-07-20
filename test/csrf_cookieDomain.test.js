'use strict';

const mm = require('egg-mock');

describe('test/csrf_cookieDomain.test.js', () => {
  afterEach(mm.restore);

  describe('cookieDomain = function', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'apps/ctoken',
      });
      return app.ready();
    });
    after(() => app.close());

    it('should auto set ctoken on GET request', () => {
      return app.httpRequest()
        .get('/hello')
        .set('Host', 'abc.foo.com:7001')
        .expect('hello ctoken')
        .expect(200)
        .expect('Set-Cookie', /ctoken=[\w\-]+; path=\/; domain=\.foo\.com/);
    });
  });

  describe('cookieDomain = string', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'apps/csrf-string-cookiedomain',
      });
      return app.ready();
    });
    after(() => app.close());

    it('should auto set csrfToken on GET request', () => {
      return app.httpRequest()
        .get('/hello')
        .set('Host', 'abc.aaaa.ddd.string.com')
        .expect('hello csrfToken')
        .expect(200)
        .expect('Set-Cookie', /csrfToken=[\w\-]+; path=\/; domain=\.string\.com/);
    });
  });

  describe('cookieOptions = object', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'apps/csrf-cookieOptions',
      });
      return app.ready();
    });
    after(() => app.close());

    it('should auto set csrfToken with cookie options on GET request', () => {
      return app.httpRequest()
        .get('/hello')
        .set('Host', 'abc.aaaa.ddd.string.com')
        .expect('hello csrfToken cookieOptions')
        .expect(200)
        .expect('Set-Cookie', /csrfToken=[\w\-]+; path=\/; httponly/);
    });
  });
});
