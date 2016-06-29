'use strict';

const isSafeDomainUtil = require('../../lib/utils').isSafeDomain;
const rndm = require('rndm');

module.exports = {

  isSafeDomain(domain) {
    const domainWhiteList = this.app.config.security.domainWhiteList || [];
    return isSafeDomainUtil(domain, domainWhiteList);
  },

  assertCSRF(/* body */) {
    throw new Error('ctx.assertCSRF() not implemented');
  },

  get csrf() {
    throw new Error('ctx.csrf getter not implemented');
  },

  // 添加nonce，随机字符串就好
  // https://w3c.github.io/webappsec/specs/content-security-policy/#nonce_source

  get nonce() {

    if (!this._nonceCache) {
      this._nonceCache = rndm(16);
    }
    return this._nonceCache;

  },

  assertCTOKEN() {
    throw new Error('ctx.assertCTOKEN not implemented');
  },

  get ctoken() {
    throw new Error('ctx.ctoken getter not implemented');
  },

  setCTOKEN() {
    throw new Error('ctx.setCTOKEN not implemented');
  },

};
