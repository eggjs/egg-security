'use strict';

const mockHtml = `
  <html>
  <head>
      <title></title>
  </head>
  <body>

  </body>
  </html>
`;


module.exports = function(app) {
  app.get('/testcsrf', function*() {
    let bodyString = "<form></form>";
    this.body = app.injectCsrf(bodyString);
  });
  app.get('/testcsrf2', function*() {
    let bodyString2 = "<form><input type=\"hidden\" name=\"_csrf\" value=\"{{ctx.csrf}}\"></form>";
    this.body = app.injectCsrf(bodyString2);
  });
  app.get('/testcsrf3', function*() {
    let bodyString9 = "<form><input type=\"hidden\" name=\'_csrf\' value=\"{{ctx.csrf}}\"></form>";
    this.body = app.injectCsrf(bodyString9);
  });
  app.get('/testnonce', function*() {
    let bodyString3 = "<script></script><script></script>";
    this.body = yield this.renderString(this.nonce + '|' + app.injectNonce(bodyString3), this);
  });
  app.get('/testnonce2', function*() {
    let bodyString4 = '<script nonce="{{ctx.nonce}}"></script><script nonce="{{ctx.nonce}}"></script>';
    // yield * this.render('index.nj',{});
    this.body = app.injectNonce(bodyString4);
  });
  app.get('/testrender', function*() {
    this.set('x-csrf', this.csrf);
    yield this.render('index.nj', {});
  });
  app.get('/testispInjection', function*() {

    const injectDefenceHtml = app.injectHijackingDefense(mockHtml);

    function mockInject(html){
      const injectScript = '<script>document.write("haha250")</script>';
      const regHackByStart = /([\S\s]*?)<\/html>/;
      return html.replace(regHackByStart,function($0,$1){
        return $1 +injectScript+'</html>'
      });
    }
    // console.log(mockInject(mockHtml));
    this.body = yield this.renderString(mockInject(injectDefenceHtml), this);

  });
};
