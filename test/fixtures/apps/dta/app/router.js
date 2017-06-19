'use strict';

module.exports = function(app) {
  app.get('/test', function *(){
    this.body = 111;
  });
};