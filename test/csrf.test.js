'use strict';

const should = require('should');
const request = require('supertest');
const mm = require('egg-mock');
const pedding = require('pedding');

describe('test/csrf.test.js', function() {
  describe('type: default', function() {
    before(function(done) {
      this.app = mm.app({
        baseDir: 'apps/csrf',
        plugin: 'security',
      });
      this.app.ready(done);
    });

    afterEach(mm.restore);

    it('should update form with csrf token', function(done) {
      const agent = request.agent(this.app.callback());

      agent
        .get('/')
        .set('accept', 'text/html')
        .expect(200, function(err, res) {
          should.not.exist(err);
          should.exist(res.text);

          const csrfToken = res.text;

          agent
            .post('/update')
            .send({
              _csrf: csrfToken,
              title: '哈哈, ok token:' + csrfToken,
            })
            .expect(200, function(err, res) {
              should.not.exist(err);
              res.body.should.eql({
                _csrf: csrfToken,
                title: '哈哈, ok token:' + csrfToken,
              });
              done();
            });
        });
    });

    it('should return 403 update form without csrf token', function(done) {
      const agent = request.agent(this.app.callback());

      agent
        .get('/')
        .set('accept', 'text/html')
        .expect(200, function(err, res) {
          should.not.exist(err);
          should.exist(res.text);
          agent
            .post('/update')
            .set('accept', 'text/html')
            .expect(403, function(err, res) {
              should.not.exist(err);
              res.text.should.equal('invalid csrf token');
              done();
            });
        });
    });

    it('should support ignore paths', function(done) {
      done = pedding(3, done);

      request(this.app.callback())
        .post('/update')
        .send({
          foo: 'bar',
        })
        .expect(403, done);

      request(this.app.callback())
        .post('/api/update')
        .send({
          foo: 'bar',
        })
        .expect(404, done);

      request(this.app.callback())
        .post('/api/users/posts')
        .send({
          foo: 'bar',
        })
        .expect(404, done);
    });

    it('should got next when is GET/HEAD/OPTIONS method', function(done) {
      done = pedding(3, done);

      request(this.app.callback())
        .get('/update.json;')
        .expect(404, done);

      request(this.app.callback())
        .head('/update.tile;')
        .expect(404, done);

      request(this.app.callback())
        .options('/update.ajax;')
        .expect(404, done);
    });

    it('should ignore when is not form path', function(done) {

      const agent = request.agent(this.app.callback());
      // Accept negotiation
      agent
        .post('/upd')
        .set('Accept', 'application/json')
        .expect(404, done);

    });

    it('should throw 500 if this.assertCSRF() throw not 403 error', function(done) {
      mm.syncError(this.app.context, 'assertCSRF', 'mock assertCSRF error');

      request(this.app.callback())
        .post('/foo')
        .expect(500, done);
    });
  });


});
