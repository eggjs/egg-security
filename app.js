'use strict';

const safeRedirect = require('./lib/safe_redirect');
const utils = require('./lib/utils');

module.exports = app => {
  app.config.coreMiddleware.push('securities');

  if (app.config.security.csrf && app.config.security.csrf.ignoreJSON) {
    app.deprecate('[egg-security] `app.config.security.csrf.ignoreJSON` is not safe now, please disable it.');
  }

  // patch response.redirect
  safeRedirect(app);

  utils.preprocessConfig(app.config.security);
};
