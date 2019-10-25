'use strict';

require('should');
const mm = require('egg-mock');

describe('test/app/extends/escapeShellCmd.test.js', function() {
  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/helper-escapeShellCmd-app',
      plugin: 'security',
    });
    this.app.ready(done);
  });

  after(mm.restore);


  describe('helper.escapeShellCmd()', function() {
    it('should convert chars in blacklists', function(done) {
      this.app.httpRequest()
        .get('/escapeShellCmd')
        .expect(200)
        .expect('true', done);
    });

    it('should not affect normal cmd', function(done) {
      this.app.httpRequest()
        .get('/escapeShellCmd-2')
        .expect(200)
        .expect('true', done);
    });


  });

});
