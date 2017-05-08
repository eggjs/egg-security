'use strict';

const safeRedirect = require('./lib/safe_redirect');

module.exports = app => {
  // format csrf.cookieDomain
  const orginalCookieDomain = app.config.security.csrf.cookieDomain;
  if (orginalCookieDomain && typeof orginalCookieDomain !== 'function') {
    app.config.security.csrf.cookieDomain = () => orginalCookieDomain;
  }

  app.config.coreMiddleware.push('securities');

  // patch response.redirect
  safeRedirect(app);
};
