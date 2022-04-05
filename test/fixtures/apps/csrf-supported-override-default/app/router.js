'use strict';

module.exports = function(app) {
  app.get('/', app.controller.home.index);
  app.post('/', app.controller.home.index);
  app.get('/rotate', app.controller.home.rotate);
  app.get('/api/rotate', app.controller.home.rotate);
  app.post('/update', app.controller.home.update);
};
