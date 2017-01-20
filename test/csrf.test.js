'use strict';

const assert = require('assert');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/csrf.test.js', function() {
  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/csrf',
      plugin: 'security',
    });
    this.app.ready(done);
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

  it('should ignore json if ignoreJSON = true', function* () {
    mm(this.app.config.security.csrf, 'ignoreJSON', true);
    yield request(this.app.callback())
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
    yield request(this.app.callback())
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


  it('should support ignore paths', function* () {
    yield request(this.app.callback())
      .post('/update')
      .send({
        foo: 'bar',
      })
      .expect(403);

    yield request(this.app.callback())
      .post('/api/update')
      .send({
        foo: 'bar',
      })
      .expect(404);

    yield request(this.app.callback())
      .post('/api/users/posts')
      .send({
        foo: 'bar',
      })
      .expect(404);
  });

  it('should got next when is GET/HEAD/OPTIONS/TRACE method', function* () {
    yield request(this.app.callback())
      .get('/update.json;')
      .expect(404);

    yield request(this.app.callback())
      .head('/update.tile;')
      .expect(404);

    yield request(this.app.callback())
      .options('/update.ajax;')
      .expect(404);

    yield request(this.app.callback())
      .trace('/update.ajax;')
      .expect(404);
  });

  it('should throw 500 if this.assertCsrf() throw not 403 error', function* () {
    mm.syncError(this.app.context, 'assertCsrf', 'mock assertCsrf error');

    yield request(this.app.callback())
      .post('/foo')
      .expect(500);
  });
});
