const mm = require('egg-mock');

describe('test/app/extends/escapeShellArg.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/helper-escapeShellArg-app',
      plugin: 'security',
    });
    return app.ready();
  });

  after(mm.restore);

  describe('helper.escapeShellArg()', () => {
    it('should add single quotes around a string', () => {
      return app.httpRequest()
        .get('/escapeShellArg')
        .expect(200)
        .expect('true');
    });

    it('should add single quotes around a string and quotes/escapes any existing single quotes', () => {
      return app.httpRequest()
        .get('/escapeShellArg-2')
        .expect(200)
        .expect('true');
    });

    it('should not affect normal arg', () => {
      return app.httpRequest()
        .get('/escapeShellArg-3')
        .expect(200)
        .expect('true');
    });
  });
});
