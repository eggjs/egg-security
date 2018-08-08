'use strict';

const mm = require('egg-mock');

describe('test/lib/helper/surl.test.js', () => {
  let app,
    app2;

  before(function* () {
    app = mm.app({
      baseDir: 'apps/helper-app',
    });
    yield app.ready();
  });

  before(function* () {
    app2 = mm.app({
      baseDir: 'apps/helper-app-surlextend',
    });
    yield app2.ready();
  });

  afterEach(mm.restore);

  after(() => {
    app.close();
    app2.close();
  });

  it('should ignore hostname without protocol', () => {
    const ctx = app.mockContext();
    ctx.helper.surl('foo.com').should.equal('');
  });

  it('should support white protocol', () => {
    const ctx = app.mockContext();
    ctx.helper.surl('http://foo.com/javascript:alert(/XSS/)').should.equal('http://foo.com/javascript:alert(/XSS/)');
    ctx.helper.surl('https://foo.com/').should.equal('https://foo.com/');
    ctx.helper.surl('https://foo.com/>').should.equal('https://foo.com/&gt;');
    ctx.helper.surl('file://foo.com/').should.equal('file://foo.com/');
    ctx.helper.surl('file://fo<o.com/').should.equal('file://fo&lt;o.com/');
    ctx.helper.surl('data://foo.com/').should.equal('data://foo.com/');
    ctx.helper.surl('//foo.com/').should.equal('//foo.com/');
    ctx.helper.surl('/////foo.com/').should.equal('/////foo.com/');
    ctx.helper.surl('/////"foo.com/').should.equal('/////&quot;foo.com/');
    ctx.helper.surl('/XXX/xxx.htm').should.equal('/XXX/xxx.htm');
    ctx.helper.surl('/XXX/\'xxx.htm').should.equal('/XXX/&#x27;xxx.htm');
  });

  it('should convert to empty string when protocol invalid', () => {
    const ctx = app.mockContext();
    ctx.helper.surl(123).should.equal(123);
    ctx.helper.surl(true).should.equal(true);
    ctx.helper.surl('datad://foo.com').should.equal('');
    ctx.helper.surl('javascript1://foo.com').should.equal('');
    /* eslint-disable no-script-url */
    ctx.helper.surl('javascript:alert(/XSS/)').should.equal('');
    ctx.helper.surl('xxx://xss.com').should.equal('');
    ctx.helper.surl('://xss.com').should.equal('');
    ctx.helper.surl('xss.com').should.equal('');
    ctx.helper.surl('    ').should.equal('');
    ctx.helper.surl('   <s> ').should.equal('');
    ctx.helper.surl('\\\\   <s> ').should.equal('');
    ctx.helper.surl('\'"></script><script/src=http://lxy.pw/04ZI2u?507706></script>&bgPicUrl=https://cdn.com/images/giftprod/T1_GNfXfxXXXXXXXXX39e6601453bedfa5afee114ae1fa9bdd&_network=wifi&ttid=201200@laiwang_iphone_5.5.2').should.equal('');
  });

  it('should support custom white protocol', () => {
    const ctx = app2.mockContext();
    ctx.helper.surl('test://foo.com').should.equal('test://foo.com');
  });

});
