'use strict';

const safeRedirect = require('./lib/safe_redirect');
const utils = require('./lib/utils');
const assert = require('assert');

module.exports = app => {
  app.config.coreMiddleware.push('securities');

  if (app.config.security.csrf) {
    const { ignoreJSON, type, refererWhiteList } = app.config.security.csrf;
    if (ignoreJSON) {
      app.deprecate('[egg-security] `app.config.security.csrf.ignoreJSON` is not safe now, please disable it.');
    }

    const { shouldCheckReferer, isLegalType } = utils.checkCsrfType(type);
    assert(isLegalType, '[egg-security] `config.security.csrf.type` must be one of ' + utils.allowTypeList.join(', '));

    // throw error if type is 'referer' but refererWhiteList is empty
    assert(!shouldCheckReferer || (shouldCheckReferer && refererWhiteList.length),
      '[egg-security] `config.security.csrf.refererWhiteList` must has at least one domain while `config.security.csrf.type` is `referer`.');
  }

  // patch response.redirect
  safeRedirect(app);

  utils.preprocessConfig(app.config.security);
};
