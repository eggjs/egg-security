'use strict';

require('should');
const request = require('supertest');
const mm = require('egg-mock');

describe('test/inject.test.js', function() {

  before(function(done) {
    this.app = mm.app({
      baseDir: 'apps/inject',
      plugin: 'security',
    });
    this.app.ready(done);
  });

  afterEach(mm.restore);

  describe('csrfInject', function() {
    it('should support inject csrf', function(done) {
      request(this.app.callback())
        .get('/testcsrf')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          const body = res.text;
          body.should.equal('<form>\r\n<input type="hidden" name="_csrf" value="{{ctx.csrf}}" /></form>');
          done();
        });
    });

    it('should not inject csrf when user write a csrf hidden area', function(done) {
      request(this.app.callback())
        .get('/testcsrf2')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          const body = res.text;
          body.should.equal('<form><input type="hidden" name="_csrf" value="{{ctx.csrf}}"></form>');
          done();
        });
    });
    it('should not inject csrf when user write a csrf hidden area within a single dot area', function(done) {
      request(this.app.callback())
        .get('/testcsrf3')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          const body = res.text;
          body.should.equal('<form><input type="hidden" name=\'_csrf\' value="{{ctx.csrf}}"></form>');
          done();
        });
    });
  });
  describe('nonceInject', function() {
    it('should inject nonce', function(done) {
      request(this.app.callback())
        .get('/testnonce')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          const body = res.text;
          const parts = body.split('|');
          const expectedNonce = parts[0];
          const scriptTag = parts[1];
          scriptTag.should.equal(`<script nonce="${expectedNonce}"></script><script nonce="${expectedNonce}"></script>`);
          done();
        });
    });
    it('should not inject nonce when existed', function(done) {
      request(this.app.callback())
        .get('/testnonce2')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          const body = res.text;
          body.should.equal('<script nonce="{{ctx.nonce}}"></script><script nonce="{{ctx.nonce}}"></script>');
          done();
        });
    });

  });

  describe('IspInjectDefence', function() {
    it('should inject IspInjectDefence', function(done) {
      request(this.app.callback())
        .get('/testispInjection')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          const body = res.text;
          body.should.equal('<!--for injection--><!--<script>document.write("haha250")</script></html>--><!--for injection-->  <html>\n  <head>\n      <title></title>\n  </head>\n  <body>\n\n  </body>\n  </html><!--for injection--><!--</html>--><!--for injection-->');
          done();
        });
    });

  });

  describe('work with view', function() {
    it('should successful render with csrf&nonce', function(done) {
      request(this.app.callback())
        .get('/testrender')
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          const body = res.text;
          // console.log(body);
          const header = res.headers['content-security-policy'];
          const csrf = res.headers['x-csrf'];
          const re_nonce = /nonce-([^']+)/;
          const nonce = header.match(re_nonce)[1];
          body.indexOf(nonce).should.not.equal(-1);
          body.indexOf(csrf).should.not.equal(-1);
          done();
        });
    });

  });


});
