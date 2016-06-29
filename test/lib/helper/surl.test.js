'use strict';

const mm = require('egg-mock');

describe('test/lib/helper/surl.test.js', () => {
  let app;

  before(done => {
    app = mm.app({
      baseDir: 'apps/helper-app',
      plugin: 'security',
    });
    app.ready(done);
  });

  after(mm.restore);

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
    ctx.helper.surl(ctx.helper.surl('file://foo.com/')).should.equal('file://foo.com/');
    ctx.helper.surl('data://foo.com/').should.equal('data://foo.com/');
    ctx.helper.surl('//foo.com/').should.equal('//foo.com/');
    ctx.helper.surl('/////foo.com/').should.equal('/////foo.com/');
    ctx.helper.surl('/XXX/xxx.htm').should.equal('/XXX/xxx.htm');
  });

  it('should convert to empty string when protocol invaild', () => {
    const ctx = app.mockContext();
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
});
