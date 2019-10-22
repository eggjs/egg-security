'use strict';

require('should');
const mm = require('egg-mock');

describe('test/app/extends/escapeShellArg.test.js', function() {
  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/helper-escapeShellArg-app',
      plugin: 'security',
    });
    this.app.ready(done);
  });

  after(mm.restore);


  describe('helper.escapeShellArg()', function() {
    it('should add single quotes around a string', function(done) {
      this.app.httpRequest()
        .get('/escapeShellArg')
        .expect(200)
        .expect('true', done);
    });

    it('should add single quotes around a string and quotes/escapes any existing single quotes', function(done) {
      this.app.httpRequest()
        .get('/escapeShellArg-2')
        .expect(200)
        .expect('true', done);
    });

    it('should not affect normal arg', function(done) {
      this.app.httpRequest()
        .get('/escapeShellArg-3')
        .expect(200)
        .expect('true', done);
    });

  });

});
