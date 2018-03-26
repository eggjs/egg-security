'use strict';

const safeRedirect = require('./lib/safe_redirect');
const utils = require('./lib/utils');

module.exports = app => {
  app.config.coreMiddleware.push('securities');

  // patch response.redirect
  safeRedirect(app);

  utils.processSSRFConfig(app.config.security.ssrf);
};
