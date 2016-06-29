'use strict';

const safeRedirect = require('./lib/safe_redirect');

module.exports = function(app) {
  app.config.coreMiddlewares.push('security');

  // patch response.redirect
  safeRedirect(app);

  require('./lib/csrf/default')(app);
  require('./lib/ctoken/default')(app);
};
