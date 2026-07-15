const { strict: assert } = require('node:assert');
const mm = require('egg-mock');
const { utils } = require('..');

describe('test/utils.test.js', () => {
  afterEach(mm.restore);
  describe('utils.isSafeDomain', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'apps/isSafeDomain',
      });
      return app.ready();
    });
    after(() => app.close());

    const domainWhiteList = [ '.domain.com', '*.alibaba.com', 'http://www.baidu.com', '192.*.0.*', 'foo.bar' ];
    it('should return false when domains are not safe', async () => {
      const res = await app.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect(200);
      assert(res.text === 'false');
    });

    it('should return true when domains are safe', async () => {
      const res = await app.httpRequest()
        .get('/safe')
        .set('accept', 'text/html')
        .expect(200);
      assert(res.text === 'true');
    });

    it('should return true', () => {
      assert(utils.isSafeDomain('domain.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('.domain.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('foo.domain.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('.foo.domain.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('.....domain.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('okokok----.domain.com', domainWhiteList) === true);

      // Wild Cast check
      assert(utils.isSafeDomain('www.alibaba.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('www.tianmao.alibaba.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('www.tianmao.AlIBAba.COm', domainWhiteList) === true);
      assert(utils.isSafeDomain('http://www.baidu.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('192.168.0.255', domainWhiteList) === true);
      assert(utils.isSafeDomain('foo.bar', domainWhiteList) === true);
    });

    it('should return false', () => {
      assert(utils.isSafeDomain('', domainWhiteList) === false);
      assert(utils.isSafeDomain(undefined, domainWhiteList) === false);
      assert(utils.isSafeDomain(null, domainWhiteList) === false);
      assert(utils.isSafeDomain(0, domainWhiteList) === false);
      assert(utils.isSafeDomain(1, domainWhiteList) === false);
      assert(utils.isSafeDomain({}, domainWhiteList) === false);
      assert(utils.isSafeDomain(function() {}, domainWhiteList) === false);
      assert(utils.isSafeDomain('aaa-domain.com', domainWhiteList) === false);
      assert(utils.isSafeDomain(' domain.com', domainWhiteList) === false);
      assert(utils.isSafeDomain('pwd---.-domain.com', domainWhiteList) === false);
      assert(utils.isSafeDomain('ok. domain.com', domainWhiteList) === false);

      // Wild Cast check
      assert(utils.isSafeDomain('www.alibaba.com.cn', domainWhiteList) === false);
      assert(utils.isSafeDomain('www.tianmao.alibab.com', domainWhiteList) === false);
      assert(utils.isSafeDomain('http://www.baidu.com/zh-CN', domainWhiteList) === false);
      assert(utils.isSafeDomain('192.168.1.255', domainWhiteList) === false);
      assert(utils.isSafeDomain('foofoo.bar', domainWhiteList) === false);
    });
  });

  describe('utils.checkIfIgnore', () => {
    async function createApp(baseDir) {
      const app = mm.app({
        baseDir,
        plugin: 'security',
      });
      await app.ready();
      return app;
    }

    it('should use match', async () => {
      const app = await createApp('apps/utils-check-if-pass');
      try {
        const res = await app.httpRequest()
          .get('/match')
          .expect(200);
        assert(res.headers['x-csp-nonce'].length === 16);
      } finally {
        await app.close();
      }
    });

    it('global match should not work', async () => {
      const app = await createApp('apps/utils-check-if-pass');
      try {
        const res = await app.httpRequest()
          .get('/luckydrq')
          .expect(200);
        assert(res.headers['x-csp-nonce'].length === 16);
      } finally {
        await app.close();
      }
    });

    it('own match should replace global match', async () => {
      const app = await createApp('apps/utils-check-if-pass2');
      try {
        let res = await app.httpRequest()
          .get('/mymatch')
          .expect(200);
        assert(res.headers['x-csp-nonce'].length === 16);
        res = await app.httpRequest()
          .get('/match')
          .expect(200);
        assert(!res.headers['x-csp-nonce']);
      } finally {
        await app.close();
      }
    });

    it('own match has priority over own ignore', async () => {
      const app = await createApp('apps/utils-check-if-pass2');
      try {
        const res = await app.httpRequest()
          .get('/mytrueignore')
          .expect(200);
        assert(!res.headers['x-csp-nonce']);
      } finally {
        await app.close();
      }
    });

    it('should not use global ignore', async () => {
      const app = await createApp('apps/utils-check-if-pass3');
      try {
        const res = await app.httpRequest()
          .get('/ignore')
          .expect(200);
        assert(res.headers['x-csp-nonce'].length === 16);
      } finally {
        await app.close();
      }
    });

    it('own ignore should replace global ignore', async () => {
      const app = await createApp('apps/utils-check-if-pass4');
      try {
        let res = await app.httpRequest()
          .get('/ignore')
          .expect(200);
        assert(res.headers['x-csp-nonce'].length === 16);
        res = await app.httpRequest()
          .get('/myignore')
          .expect(200);
        assert(!res.headers['x-csp-nonce']);
      } finally {
        await app.close();
      }
    });

    it('should ignore array work', async () => {
      const app = await createApp('apps/utils-check-if-pass5');
      try {
        let res = await app.httpRequest()
          .get('/ignore1')
          .expect(200);
        assert(!res.headers['x-frame-options']);

        res = await app.httpRequest()
          .get('/ignore2')
          .expect(200);
        assert(!res.headers['x-frame-options']);

        res = await app.httpRequest()
          .get('/')
          .expect(200);
        assert(res.header['x-frame-options']);
      } finally {
        await app.close();
      }
    });

    it('should match array work', async () => {
      const app = await createApp('apps/utils-check-if-pass6');
      try {
        let res = await app.httpRequest()
          .get('/match1')
          .expect(200);
        assert(res.headers['x-frame-options']);

        res = await app.httpRequest()
          .get('/match2')
          .expect(200);
        assert(res.headers['x-frame-options']);

        res = await app.httpRequest()
          .get('/')
          .expect(200);
        assert(!res.headers['x-frame-options']);
      } finally {
        await app.close();
      }
    });
  });
});
