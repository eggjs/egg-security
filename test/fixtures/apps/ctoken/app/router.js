'use strict';

module.exports = function(app) {
  app.get('/', app.controller.home.index);
  app.get('/foo', app.controller.home.index);
  app.get('/localhost', app.controller.home.localhost);
  app.post('/api/update.json', app.controller.home.index);
  app.post('/api/users/posts.json', app.controller.home.index);
  app.post('/update.json', app.controller.home.update);
};
