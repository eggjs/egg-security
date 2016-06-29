'use strict';

let methods = require('methods');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/method_not_allow.test.js', function() {

  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/method',
      plugin: 'security',
    });
    this.app.ready(done);
  });

  afterEach(mm.restore);

  it('should allow', function(done) {
    const _self = this;
    let count = 0,
      exCount = 0,
      keepgoing = true;
    const exclude = [ 'trace', 'track', 'options' ];

    methods = methods.filter(function(m) {
      return _self.app[m];
    });

    methods.forEach(function(method) {
      if (!keepgoing) {
        return;
      }
      if (exclude.indexOf(method) !== -1) {
        ++exCount;
        return;
      }

      request(_self.app.callback())[method]('/')
        .expect(200)
        .end(function(err) {
          if (err) {
            keepgoing = false;
            return done(err);
          }

          ++count;

          if (count === methods.length - exCount) {
            return done();
          }
        });
    });
  });

  it('should not allow trace method', function(done) {

    request(this.app.callback())
      .trace('/')
      .set('accept', 'text/html')
      .expect(405, done);
  });

  it('should not allow option method', function(done) {

    request(this.app.callback())
      .options('/')
      .set('accept', 'text/html')
      .expect(405, done);
  });
});
