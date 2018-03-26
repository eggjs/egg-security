'use strict';

const mm = require('egg-mock');
const dns = require('dns');
const assert = require('assert');

let app;
describe('test/ssrf.test.js', function() {
  afterEach(mm.restore);

  describe('no ssrf config', () => {
    before(() => {
      app = mm.app({ baseDir: 'apps/csrf' });
      return app.ready();
    });

    it('should safeCurl work', function* () {
      const ctx = app.createAnonymousContext();
      const url = 'https://127.0.0.1';
      mm.data(app, 'curl', 'response');
      mm.data(app.agent, 'curl', 'response');
      mm.data(ctx, 'curl', 'response');

      let count = 0;
      function mockWarn(msg) {
        count++;
        assert(msg === '[egg-security] please configure `config.security.ssrf` first');
      }

      mm(app.logger, 'warn', mockWarn);
      mm(app.agent.logger, 'warn', mockWarn);
      mm(ctx.logger, 'warn', mockWarn);

      const r1 = yield app.safeCurl(url);
      const r2 = yield app.agent.safeCurl(url);
      const r3 = yield ctx.safeCurl(url);
      assert(r1 === 'response');
      assert(r2 === 'response');
      assert(r3 === 'response');
      assert(count === 3);
    });
  });


  describe('ipBlackList', () => {
    before(() => {
      app = mm.app({ baseDir: 'apps/ssrf-ip-black-list' });
      return app.ready();
    });

    it('should safeCurl work', function* () {
      const urls = [
        'https://127.0.0.1/foo',
        'http://10.1.2.3/foo?bar=1',
        'https://0.0.0.0/',
        'https://www.google.com/',
      ];
      mm.data(dns, 'lookup', '127.0.0.1');
      const ctx = app.createAnonymousContext();

      for (const url of urls) {
        yield checkIllegalAddressError(app, url);
        yield checkIllegalAddressError(app.agent, url);
        yield checkIllegalAddressError(ctx, url);
      }
    });
  });

  describe('checkAddress', () => {
    before(() => {
      app = mm.app({ baseDir: 'apps/ssrf-check-address' });
      return app.ready();
    });

    it('should safeCurl work', function* () {
      const urls = [
        'https://127.0.0.2/foo',
        'https://www.google.com/foo',
      ];
      mm.data(dns, 'lookup', '127.0.0.2');
      const ctx = app.createAnonymousContext();
      for (const url of urls) {
        yield checkIllegalAddressError(app, url);
        yield checkIllegalAddressError(app.agent, url);
        yield checkIllegalAddressError(ctx, url);
      }
    });
  });
});

function* checkIllegalAddressError(instance, url) {
  try {
    yield instance.safeCurl(url);
    throw new Error('should not execute');
  } catch (err) {
    assert(err.name === 'IllegalAddressError');
  }
}
