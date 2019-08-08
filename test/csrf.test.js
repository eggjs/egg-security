'use strict';

const assert = require('assert');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/csrf.test.js', () => {
  before(function* () {
    this.app = mm.app({
      baseDir: 'apps/csrf',
      plugin: 'security',
    });
    yield this.app.ready();
    this.app2 = mm.app({
      baseDir: 'apps/csrf-multiple',
      plugin: 'security',
    });
    yield this.app2.ready();
  });

  afterEach(mm.restore);

  it('should throw when session disabled and useSession enabled', function* () {
    try {
      const app = mm.app({ baseDir: 'apps/csrf-session-disable' });
      yield app.ready();
      throw new Error('should not execute');
    } catch (err) {
      assert(err.message === 'csrf.useSession enabled, but session plugin is disabled');
    }
  });

  it('should update form with csrf token', function* () {
    const agent = request.agent(this.app.callback());

    let res = yield agent
      .get('/')
      .set('accept', 'text/html')
      .expect(200);
    assert(res.text);
    const csrfToken = res.text;
    res = yield agent
      .post('/update')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      })
      .expect(200)
      .expect({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      });
  });

  it('should update form with csrf token rotate', function* () {
    const agent = request.agent(this.app.callback());

    yield agent
      .get('/')
      .set('accept', 'text/html')
      .expect(200);
    let res = yield agent
      .get('/rotate')
      .set('accept', 'text/html')
      .expect(200);
    assert(res.text);
    const csrfToken = res.text;
    res = yield agent
      .post('/update')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      })
      .expect(200)
      .expect({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      });
  });

  it('should not set cookie when rotate without csrf token', function* () {
    yield this.app.httpRequest()
      .get('/api/rotate')
      .set('accept', 'text/html')
      .expect(200)
      .expect('')
      .expect(res => {
        assert(!res['set-cookie']);
      });
  });

  it('should update form with csrf token using session', function* () {
    mm(this.app.config.security.csrf, 'useSession', true);
    const agent = request.agent(this.app.callback());

    let res = yield agent
      .get('/')
      .set('accept', 'text/html')
      .expect(200);
    assert(res.text);
    const csrfToken = res.text;
    res = yield agent
      .post('/update')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      })
      .expect(200)
      .expect({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      });
  });

  it('should update json with csrf token using session', function* () {
    mm(this.app.config.security.csrf, 'useSession', true);
    const agent = request.agent(this.app.callback());

    let res = yield agent
      .get('/')
      .set('accept', 'text/html')
      .expect(200);
    assert(res.text);
    const csrfToken = res.text;
    res = yield agent
      .post('/update')
      .send({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      })
      .expect(200)
      .expect({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      });
  });

  it('should update form with csrf token from cookie and set to header', function* () {
    const agent = request.agent(this.app.callback());

    let res = yield agent
      .get('/')
      .set('accept', 'text/html')
      .expect(200);
    assert(res.text);
    const cookie = res.headers['set-cookie'].join(';');
    const csrfToken = cookie.match(/csrfToken=(.*?);/)[1];
    res = yield agent
      .post('/update')
      .set('x-csrf-token', csrfToken)
      .send({
        title: `ok token: ${csrfToken}`,
      })
      .expect(200)
      .expect({
        title: `ok token: ${csrfToken}`,
      });
  });

  it('should update form with csrf token from cookie and set to query', function* () {
    const agent = request.agent(this.app.callback());

    let res = yield agent
      .get('/')
      .set('accept', 'text/html')
      .expect(200);
    assert(res.text);
    const cookie = res.headers['set-cookie'].join(';');
    const csrfToken = cookie.match(/csrfToken=(.*?);/)[1];
    res = yield agent
      .post(`/update?_csrf=${csrfToken}`)
      .send({
        title: `ok token: ${csrfToken}`,
      })
      .expect(200)
      .expect({
        title: `ok token: ${csrfToken}`,
      });
  });

  it('should update form with csrf token from cookie and support multiple query input', function* () {
    const agent = request.agent(this.app2.callback());

    let res = yield agent
      .get('/')
      .set('accept', 'text/html')
      .expect(200);
    assert(res.text);
    const cookie = res.headers['set-cookie'].join(';');
    const csrfToken = cookie.match(/csrfToken=(.*?);/)[1];
    res = yield agent
      .post(`/update?_csrf=${csrfToken}`)
      .send({
        title: `ok token: ${csrfToken}`,
      })
      .expect(200)
      .expect({
        title: `ok token: ${csrfToken}`,
      });
    res = yield agent
      .post(`/update?_csgo=${csrfToken}`)
      .send({
        title: `ok token: ${csrfToken}`,
      })
      .expect(200)
      .expect({
        title: `ok token: ${csrfToken}`,
      });
  });

  it('should update form with csrf token from cookie and set to body', function* () {
    const agent = request.agent(this.app.callback());

    let res = yield agent
      .get('/')
      .set('accept', 'text/html')
      .expect(200);
    assert(res.text);
    const cookie = res.headers['set-cookie'].join(';');
    const csrfToken = cookie.match(/csrfToken=(.*?);/)[1];
    res = yield agent
      .post('/update')
      .send({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      })
      .expect(200)
      .expect({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      });
  });

  it('should update form with csrf token from cookie and and support multiple body input', function* () {
    const agent = request.agent(this.app2.callback());

    let res = yield agent
      .get('/')
      .set('accept', 'text/html')
      .expect(200);
    assert(res.text);
    const cookie = res.headers['set-cookie'].join(';');
    const csrfToken = cookie.match(/csrfToken=(.*?);/)[1];
    res = yield agent
      .post('/update')
      .send({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      })
      .expect(200)
      .expect({
        _csrf: csrfToken,
        title: `ok token: ${csrfToken}`,
      });
    res = yield agent
      .post('/update')
      .send({
        _csgo: csrfToken,
        title: `ok token: ${csrfToken}`,
      })
      .expect(200)
      .expect({
        _csgo: csrfToken,
        title: `ok token: ${csrfToken}`,
      });
  });

  it('should show deprecate message if ignoreJSON = true', function* () {
    const app = mm.app({ baseDir: 'apps/csrf-ignorejson' });
    yield app.ready();
    // will show deprecate message
  });

  it('should ignore json if ignoreJSON = true', function* () {
    mm(this.app.config.security.csrf, 'ignoreJSON', true);
    yield this.app.httpRequest()
      .post('/update')
      .send({
        title: 'without token ok',
      })
      .expect(200)
      .expect({
        title: 'without token ok',
      });
  });

  it('should ignore json if ignoreJSON = true and body not exist', function* () {
    mm(this.app.config.security.csrf, 'ignoreJSON', true);
    yield this.app.httpRequest()
      .post('/update')
      .set('content-length', '')
      .set('content-type', 'application/json')
      .expect(200)
      .expect({});
  });

  it('should not ignore form if ignoreJSON = true', function* () {
    mm(this.app.config.security.csrf, 'ignoreJSON', true);
    yield this.app.httpRequest()
      .post('/update')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        title: 'without token ok',
      })
      .expect(403);
  });

  it('should return 403 update form without csrf token', function* () {
    const agent = request.agent(this.app.callback());

    yield agent
      .get('/')
      .set('accept', 'text/html')
      .expect(200);

    yield agent
      .post('/update')
      .set('accept', 'text/html')
      .expect(403)
      .expect(/invalid csrf token/);
  });

  it('should return 403 and log debug info in local env', function* () {
    mm(this.app.config, 'env', 'local');
    this.app.mockLog();
    const agent = request.agent(this.app.callback());

    yield agent
      .get('/')
      .set('accept', 'text/html')
      .expect(200);

    yield agent
      .post('/update')
      .set('accept', 'text/html')
      .expect(403)
      .expect(/invalid csrf token/);
    this.app.expectLog('invalid csrf token. See http');
  });

  it('should return 403 update form without csrf secret', function* () {
    yield this.app.httpRequest()
      .post('/update')
      .set('accept', 'text/html')
      .expect(403)
      .expect(/missing csrf token/);
  });

  it('should return 403 and log debug info in local env', function* () {
    mm(this.app.config, 'env', 'local');
    this.app.mockLog();
    yield this.app.httpRequest()
      .post('/update')
      .set('accept', 'text/html')
      .expect(403)
      .expect(/missing csrf token/);
    this.app.expectLog('missing csrf token. See http');
  });

  it('should support ignore paths', function* () {
    yield this.app.httpRequest()
      .post('/update')
      .send({
        foo: 'bar',
      })
      .expect(403);

    yield this.app.httpRequest()
      .post('/api/update')
      .send({
        foo: 'bar',
      })
      .expect(404);

    yield this.app.httpRequest()
      .post('/api/users/posts')
      .send({
        foo: 'bar',
      })
      .expect(404);
  });

  it('should support ignore function', function* () {
    yield this.app.httpRequest()
      .post('/update')
      .send({
        foo: 'bar',
      })
      .expect(403);

    yield this.app.httpRequest()
      .post('/update')
      .send({
        foo: 'bar',
      })
      .set('ignore-csrf', 'true')
      .expect(200);
  });

  it('should got next when is GET/HEAD/OPTIONS/TRACE method', function* () {
    yield this.app.httpRequest()
      .get('/update.json;')
      .expect(404);

    yield this.app.httpRequest()
      .head('/update.tile;')
      .expect(404);

    yield this.app.httpRequest()
      .options('/update.ajax;')
      .expect(404);

    yield this.app.httpRequest()
      .trace('/update.ajax;')
      .expect(404);
  });

  it('should throw 500 if this.assertCsrf() throw not 403 error', function* () {
    mm.syncError(this.app.context, 'assertCsrf', 'mock assertCsrf error');

    yield this.app.httpRequest()
      .post('/foo')
      .expect(500);
  });

  it('should assertCsrf ignore path', function() {
    const ctx = this.app2.mockContext({
      path: '/api/foo',
    });
    ctx.assertCsrf();
  });

  it('should assertCsrf throw if not ignore', function(done) {
    const ctx = this.app2.mockContext({
      path: '/foo/bar',
    });
    try {
      ctx.assertCsrf();
    } catch (err) {
      assert(err.message, 'missing csrf token');
      done();
    }
  });

  it('should return 200 with correct referer when type is referer', function* () {
    mm(this.app.config, 'env', 'local');
    mm(this.app.config.security.csrf, 'type', 'referer');
    mm(this.app.config.security.csrf, 'refererWhiteList', [ 'nodejs.org' ]);
    this.app.mockLog();
    yield this.app.httpRequest()
      .post('/update')
      .set('accept', 'text/html')
      .set('referer', 'https://nodejs.org/en/')
      .expect(200);
  });

  it('should return 200 with same domain request', function* () {
    mm(this.app.config, 'env', 'local');
    mm(this.app.config.security.csrf, 'type', 'referer');
    this.app.mockLog();
    const httpRequestObj = this.app.httpRequest().post('/update');
    const port = httpRequestObj.app.address().port;
    yield httpRequestObj
      .set('accept', 'text/html')
      .set('referer', `http://127.0.0.1:${port}/`)
      .expect(200);
  });

  it('should return 403 with different domain request', function* () {
    mm(this.app.config, 'env', 'local');
    mm(this.app.config.security.csrf, 'type', 'referer');
    this.app.mockLog();
    yield this.app.httpRequest()
      .post('/update')
      .set('accept', 'text/html')
      .set('referer', 'https://nodejs.org/en/')
      .expect(403);
  });

  it('should check both ctoken and referer when type is all', function* () {
    mm(this.app.config.security.csrf, 'type', 'all');
    mm(this.app.config.security.csrf, 'refererWhiteList', [ 'https://eggjs.org/' ]);
    this.app.mockLog();
    yield this.app.httpRequest()
      .post('/update')
      .set('accept', 'text/html')
      .set('referer', 'https://eggjs.org/en/')
      .expect(403)
      .expect(/missing csrf token/);
    yield this.app.httpRequest()
      .post('/update')
      .send({ _csrf: '1' })
      .set('accept', 'text/html')
      .set('cookie', 'csrfToken=1')
      .expect(403)
      .expect(/missing csrf referer/);
  });

  it('should return 403 without referer when type is referer', function* () {
    mm(this.app.config, 'env', 'local');
    mm(this.app.config.security.csrf, 'type', 'referer');
    mm(this.app.config.security.csrf, 'refererWhiteList', [ 'https://eggjs.org/' ]);
    this.app.mockLog();
    yield this.app.httpRequest()
      .post('/update')
      .set('accept', 'text/html')
      .expect(403)
      .expect(/missing csrf referer/);
    this.app.expectLog('missing csrf referer. See http');
  });

  it('should return 403 with invalid referer when type is referer', function* () {
    mm(this.app.config, 'env', 'local');
    mm(this.app.config.security.csrf, 'type', 'referer');
    mm(this.app.config.security.csrf, 'refererWhiteList', [ 'https://eggjs.org/' ]);
    this.app.mockLog();
    yield this.app.httpRequest()
      .post('/update')
      .set('accept', 'text/html')
      .set('referer', 'https://nodejs.org/en/')
      .expect(403)
      .expect(/invalid csrf referer/);
    this.app.expectLog('invalid csrf referer. See http');
  });

  it('should throw with error type', function* () {
    const app = mm.app({
      baseDir: 'apps/csrf-error-type',
      plugin: 'security',
    });

    try {
      yield app.ready();
      throw new Error('should throw error');
    } catch (e) {
      assert(e.message.includes('`config.security.csrf.type` must be one of all, referer, ctoken'));
    }
  });
});
