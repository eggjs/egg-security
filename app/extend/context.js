'use strict';

const isSafeDomainUtil = require('../../lib/utils').isSafeDomain;
const rndm = require('rndm');
const Tokens = require('csrf');

const tokens = new Tokens();

const CSRF_SECRET = Symbol('egg-security#CSRF_SECRET');
const NEW_CSRF_SECRET = Symbol('egg-security#NEW_CSRF_SECRET');

module.exports = {
  get securityOptions() {
    if (!this._securityOptions) {
      this._securityOptions = {};
    }
    return this._securityOptions;
  },

  isSafeDomain(domain) {
    const domainWhiteList = this.app.config.security.domainWhiteList || [];
    return isSafeDomainUtil(domain, domainWhiteList);
  },

  // 添加nonce，随机字符串就好
  // https://w3c.github.io/webappsec/specs/content-security-policy/#nonce_source

  get nonce() {
    if (!this._nonceCache) {
      this._nonceCache = rndm(16);
    }
    return this._nonceCache;
  },

  get csrfSecret() {
    if (this[CSRF_SECRET]) return this[CSRF_SECRET];
    const { useSession, cookieName, sessionName } = this.app.config.security.csrf;
    // get secret from session or cookie
    if (useSession) {
      this[CSRF_SECRET] = this.session[sessionName] || '';
    } else {
      this[CSRF_SECRET] = this.cookies.get(cookieName, { signed: false }) || '';
    }
    return this[CSRF_SECRET];
  },

  get csrf() {
    const secret = this[CSRF_SECRET] || this[NEW_CSRF_SECRET];
    return secret ? tokens.create(secret) : '';
  },

  setCsrfSecret() {
    const secret = tokens.secretSync();
    this[NEW_CSRF_SECRET] = secret;
    const { useSession, sessionName, cookieDomain, cookieName } = this.app.config.security.csrf;

    if (useSession) {
      this.session[sessionName] = secret;
    } else {
      const cookieOpts = {
        domain: cookieDomain,
        signed: false,
        httpOnly: false,
      };
      this.cookies.set(cookieName, secret, cookieOpts);
    }
  },

  assertCsrf() {
    if (!this.csrfSecret) {
      this.coreLogger.warn('missing cookie csrf token');
      this.throw(403, 'missing cookie csrf token');
    }

    const headerName = this.app.config.security.csrf.headerName;
    const bodyName = this.app.config.security.csrf.bodyName;
    const token = this.get(headerName) || (this.request.body && this.request.body[bodyName]);

    // ajax requests get token from cookie, so token will equal secret
    if (token !== this.csrfSecret && !tokens.verify(this.csrfSecret, token)) {
      this.coreLogger.warn('invalid csrf token');
      this.throw(403, 'invalid csrf token');
    }
  },
};
