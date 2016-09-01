'use strict';

const methods = require('methods');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/method_not_allow.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/method',
      plugin: 'security',
    });
    return app.ready();
  });

  afterEach(mm.restore);

  after(() => app.close());

  it('should allow', done => {
    let count = 0,
      exCount = 0,
      keepgoing = true;
    const exclude = [ 'trace', 'track', 'options' ];

    const ms = methods.filter(m => {
      return app[m];
    });

    ms.forEach(method => {
      if (!keepgoing) {
        return;
      }
      if (exclude.indexOf(method) !== -1) {
        ++exCount;
        return;
      }

      request(app.callback())[method]('/')
        .expect(200)
        .end(err => {
          if (err) {
            keepgoing = false;
            return done(err);
          }

          ++count;

          if (count === ms.length - exCount) {
            return done();
          }
        });
    });
  });

  it('should not allow trace method', () => {
    return request(app.callback())
      .trace('/')
      .set('accept', 'text/html')
      .expect(405);
  });

  it('should not allow option method', () => {
    return request(app.callback())
      .options('/')
      .set('accept', 'text/html')
      .expect(405);
  });
});
