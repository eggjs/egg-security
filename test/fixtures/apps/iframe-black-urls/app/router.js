'use strict';

module.exports = function(app) {
  app.get('/hello', controller);
  app.get('/hello/other/world', controller);

  function* controller() {
    this.body = 'body';
  }
};
