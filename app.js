'use strict';

const safeRedirect = require('./lib/safe_redirect');

module.exports = app => {
  app.config.coreMiddleware.push('security');

  // patch response.redirect
  safeRedirect(app);

  require('./lib/csrf/default')(app);
};
