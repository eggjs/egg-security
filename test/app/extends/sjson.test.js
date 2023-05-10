const mm = require('egg-mock');

describe('test/app/extends/sjson.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/helper-sjson-app',
      plugin: 'security',
    });
    return app.ready();
  });

  after(mm.restore);

  describe('helper.sjson()', () => {
    it('should not convert json string when json is safe', () => {
      return app.httpRequest()
        .get('/safejson')
        .expect(200)
        .expect('true');
    });

    it('should not convert json string when json is safe contains array', () => {
      return app.httpRequest()
        .get('/safejsontc2')
        .expect(200)
        .expect('true');
    });
    it('should not convert json string when json is safe contains string', () => {
      return app.httpRequest()
        .get('/safejsontc3')
        .expect(200)
        .expect('true');
    });
    it('should not convert json string when json is safe contains object', () => {
      return app.httpRequest()
        .get('/safejsontc4')
        .expect(200)
        .expect('true');
    });
    it('should not convert json string when json is safe contains symbel', () => {
      return app.httpRequest()
        .get('/safejsontc5')
        .expect(200)
        .expect('true');
    });
    it('should not convert json string when json is safe contains function', () => {
      return app.httpRequest()
        .get('/safejsontc6')
        .expect(200)
        .expect('true');
    });
    it('should not convert json string when json is safe contains buffer', () => {
      return app.httpRequest()
        .get('/safejsontc7')
        .expect(200)
        .expect('true');
    });
    it('should not convert json string when json is safe contains null', () => {
      return app.httpRequest()
        .get('/safejsontc8')
        .expect(200)
        .expect('true');
    });
    it('should not convert json string when json is safe contains undefined', () => {
      return app.httpRequest()
        .get('/safejsontc9')
        .expect(200)
        .expect('true');
    });
    it('should not convert json string when json is safe contains boolean', () => {
      return app.httpRequest()
        .get('/safejsontc10')
        .expect(200)
        .expect('true');
    });

    it('should convert json string when json contains unsafe key or value', () => {
      return app.httpRequest()
        .get('/unsafejson')
        .expect(200)
        .expect('true');
    });

    it('should convert json string when json contains unsafe value nested', () => {
      return app.httpRequest()
        .get('/unsafejson2')
        .expect(200)
        .expect('true');
    });

    it('should convert json string when json contains unsafe value nested in array', () => {
      return app.httpRequest()
        .get('/unsafejson3')
        .expect(200)
        .expect('true');
    });

    it('should convert json string when json contains unsafe key nested in array', () => {
      return app.httpRequest()
        .get('/unsafejson4')
        .expect(200)
        .expect('true');
    });

    it('should convert json string when json contains unsafe key', () => {
      return app.httpRequest()
        .get('/unsafejson5')
        .expect(200)
        .expect('true');
    });
  });
});
