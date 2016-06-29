'use strict';

const should = require('should');
const request = require('supertest');
const mm = require('egg-mock');
const pedding = require('pedding');
const fs = require('fs');
const path = require('path');

describe('test/ctoken.test.js', function() {
  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/ctoken',
      plugin: 'security',
    });
    this.app.ready(done);
  });

  afterEach(mm.restore);

  it('should 403 when ctoken is not set', function(done) {
    request(this.app.callback())
    .post('/foo.json')
    .set('accept', 'application/json')
    .send({
      foo: 'bar',
    })
    .expect({
      message: 'missing cookie ctoken',
    })
    .expect(403, () => {
      const log = fs.readFileSync(path.join(__dirname, 'fixtures/apps/ctoken/logs/ctoken/egg-web.log'), 'utf8');
      log.should.match(/missing cookie ctoken/);
      done();
    });
  });

  it('should 403 when ctoken missing', function(done) {
    const agent = request.agent(this.app.callback());
    agent
    .get('/')
    .expect(200, function() {
      agent
      .post('/foo.json')
      .set('accept', 'application/json')
      .send({
        foo: 'bar',
      })
      .expect({
        message: 'missing request ctoken',
      })
      .expect(403, () => {
        const log = fs.readFileSync(path.join(__dirname, 'fixtures/apps/ctoken/logs/ctoken/egg-web.log'), 'utf8');
        log.should.match(/missing request ctoken/);
        done();
      });
    });
  });

  it('should block ajax request if querystring ctoken is wrong', function(done) {
    const agent = request.agent(this.app.callback());
    agent
    .get('/')
    .expect(200, function() {
      agent
      .get('/update.json?ctoken=123')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({
        message: 'invalid ctoken',
      })
      .expect(403, () => {
        // invalid ctoken, requestToken 123(querystring), expectToken b5AsFsLxiPsft6zIbMs5ctoken
        const log = fs.readFileSync(path.join(__dirname, 'fixtures/apps/ctoken/logs/ctoken/egg-web.log'), 'utf8');
        log.should.match(/invalid ctoken, requestToken 123\(querystring\), expectToken \S{20}ctoken/);
        done();
      });
    });
  });

  it('should return json when no X-Requested-With header', function(done) {
    const agent = request.agent(this.app.callback());
    agent
    .get('/')
    .expect(200, function() {
      agent
      .get('/update.json?ctoken=123')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect({
        message: 'invalid ctoken',
      })
      .expect(403, done);
    });
  });

  it('should pass when ctoken match on ajax request', function(done) {
    done = pedding(4, done);
    const agent = request.agent(this.app.callback());
    // fist time set ctoken to cookie
    agent
    .get('/')
    .expect(200, function() {
      // second time get cookie
      agent
      .get('/')
      .expect(200, function(err, res) {
        const ctokenValue = res.body.ctoken;

        // body.ctoken
        agent
        .post('/update.json?uid=xuezu')
        .send({
          foo: 'bar',
          ctoken: ctokenValue,
        })
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.body.should.eql({
            foo: 'bar',
            ctoken: ctokenValue,
          });
          done();
        });

        // body.ctoken decoding
        const encodeCtokenValue = encodeURIComponent(ctokenValue);
        agent
        .post('/update.json?uid=suqian.yf')
        .send({
          foo: 'bar',
          ctoken: encodeCtokenValue,
        })
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.body.should.eql({
            foo: 'bar',
            ctoken: encodeCtokenValue,
          });
          done();
        });

        // querystring.ctoken
        agent
        .post('/update.json?ctoken=' + encodeCtokenValue)
        .send({
          foo: 'bar',
        })
        .set('accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.body.should.eql({
            foo: 'bar',
          });
          done();
        });

        // request header
        agent
        .post('/update.json')
        .send({
          foo: 'bar',
        })
        .set('x-csrf-token', ctokenValue)
        .set('accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.body.should.eql({
            foo: 'bar',
          });
          done();
        });
      });
    });
  });

  it('should support ignore paths', function(done) {
    done = pedding(3, done);

    request(this.app.callback())
    .post('/update.json')
    .send({
      foo: 'bar',
    })
    .expect(403, done);

    request(this.app.callback())
    .post('/api/update.json')
    .send({
      foo: 'bar',
    })
    .expect({
      method: 'POST',
      url: '/api/update.json',
      body: {
        foo: 'bar',
      },
      // ctoken: null,
    })
    .expect(200, done);

    request(this.app.callback())
    .post('/api/users/posts.json')
    .send({
      foo: 'bar',
    })
    .expect({
      method: 'POST',
      url: '/api/users/posts.json',
      body: {
        foo: 'bar',
      },
      // ctoken: null,
    })
    .expect(200, done);
  });

  it('should not set domain field in cookie when hostname is localhost', function(done) {
    this.app.mockContext({
      hostname: 'localhost',
    });
    request(this.app.callback())
    .get('/localhost')
    .end(function(err, res) {
      should.not.exist(err);
      const cookie = res.headers['set-cookie'][0];
      cookie.indexOf('domain').should.eql(-1);
      done();
    });
  });

});
