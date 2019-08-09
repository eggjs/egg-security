'use strict';

const safeRedirect = require('./lib/safe_redirect');
const utils = require('./lib/utils');
const assert = require('assert');

module.exports = app => {
  app.config.coreMiddleware.push('securities');

  if (app.config.security.csrf && app.config.security.csrf.enable) {
    const { ignoreJSON, type } = app.config.security.csrf;
    if (ignoreJSON) {
      app.deprecate('[egg-security] `app.config.security.csrf.ignoreJSON` is not safe now, please disable it.');
    }

    const { isLegalType } = utils.checkCsrfType(type);
    assert(isLegalType, '[egg-security] `config.security.csrf.type` must be one of ' + utils.allowTypeList.join(', '));
  }

  // patch response.redirect
  safeRedirect(app);

  utils.preprocessConfig(app.config.security);
};
