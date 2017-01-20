'use strict';

const safeRedirect = require('./lib/safe_redirect');

module.exports = app => {
  app.config.coreMiddleware.push('securities');

  // patch response.redirect
  safeRedirect(app);
};
