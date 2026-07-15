import assert from 'node:assert/strict';
import { exec as childProcessExec } from 'node:child_process';
import { promisify } from 'node:util';

import { mm, MockApplication } from '@eggjs/mock';

import escapeShellArg from '../../../src/lib/helper/escapeShellArg.js';

const exec = promisify(childProcessExec);
const itOnPosix = process.platform === 'win32' ? it.skip : it;

describe('test/app/extends/escapeShellArg.test.ts', () => {
  let app: MockApplication;
  before(() => {
    app = mm.app({
      baseDir: 'apps/helper-escapeShellArg-app',
    });
    return app.ready();
  });

  after(() => app.close());

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
      const payload = "'; echo EGG_SECURITY_INJECTED; #";
      const { stdout } = await exec(`printf 'ARG:%s\\n' ${escapeShellArg(payload)}`);

      assert.equal(stdout, 'ARG:\'; echo EGG_SECURITY_INJECTED; #\n');
    });
  });
});
