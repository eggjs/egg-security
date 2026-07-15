// eslint-disable-next-line no-restricted-modules
const assert = require('assert');
// eslint-disable-next-line no-restricted-modules
const { exec: childProcessExec } = require('child_process');
// eslint-disable-next-line no-restricted-modules
const { promisify } = require('util');

const mm = require('egg-mock');

const escapeShellArg = require('../../../lib/helper/escapeShellArg');

const exec = promisify(childProcessExec);
const itOnPosix = process.platform === 'win32' ? it.skip : it;

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

    itOnPosix('should keep single quotes inside one shell argument', async () => {
      const payload = '\'; echo EGG_SECURITY_INJECTED; #';
      const { stdout } = await exec(`printf 'ARG:%s\\n' ${escapeShellArg(payload)}`);

      assert.strictEqual(stdout, 'ARG:\'; echo EGG_SECURITY_INJECTED; #\n');
    });
  });
});
