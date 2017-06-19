'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/csrf.test.js', function() {
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

    const log = fs.readFileSync(path.join(__dirname, 'fixtures/apps/csrf/logs/csrf/csrf-web.log'), 'utf8');
    assert(log.indexOf('invalid csrf token. See http') > -1);
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
    yield this.app.httpRequest()
      .post('/update')
      .set('accept', 'text/html')
      .expect(403)
      .expect(/missing csrf token/);

    const log = fs.readFileSync(path.join(__dirname, 'fixtures/apps/csrf/logs/csrf/csrf-web.log'), 'utf8');
    assert(log.indexOf('missing csrf token. See http') > -1);
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
});
