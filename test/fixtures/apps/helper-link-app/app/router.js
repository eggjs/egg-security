'use strict';

module.exports = function(app) {

  app.get('/shtml-ignore-hash', function*() {
    this.body = this.helper.shtml('<a href="#abc">xx</a>') == '<a href="#abc">xx</a>';
  });

  app.get('/shtml-not-in-whitelist', function*() {
    this.body = this.helper.shtml('<a href="http://www.baidu.com#abc">xx</a>') == '<a href="">xx</a>';
  });

};