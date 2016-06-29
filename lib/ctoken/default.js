'use strict';

const utility = require('utility');
const compare = require('tsscmp');
const utils = require('../utils');

module.exports = function(app) {
  const key = 'ctoken';
  const context = app.context;

  Object.defineProperty(context, 'ctoken', {
    get() {
      return this._ctoken || (this._ctoken = this.getCookie(key));
    },
  });

  context.setCTOKEN = function() {
    setCTOKEN.call(this, key);
    return true;
  };

  context.assertCTOKEN = context.assertCtoken = function() {
    if (!this.ctoken) {
      this.coreLogger.warn('missing cookie ctoken');
      this.throw(403, 'missing cookie ctoken');
    }

    let requestToken = this.query && this.query[key];
    let requestTokenFrom = 'querystring';
    if (!requestToken && (this.method !== 'GET' && this.method !== 'HEAD' && this.method !== 'OPTIONS')) {
      const body = this.request.body;
      requestTokenFrom = 'body';
      requestToken = body && body[key];
    }

    if (!requestToken && this.get('x-csrf-token')) {
      requestTokenFrom = 'x-csrf-token';
      requestToken = this.get('x-csrf-token');
    }

    if (!requestToken) {
      this.coreLogger.warn('missing request ctoken');
      this.throw(403, 'missing request ctoken');
    }

    if (!compare(requestToken, this.ctoken) && !compare(utility.decodeURIComponent(requestToken), this.ctoken)) {
      this.coreLogger.warn(`invalid ctoken, requestToken ${requestToken}(${requestTokenFrom}), expectToken ${this.ctoken}`);
      this.throw(403, 'invalid ctoken');
    }
  };
};

module.exports.setCTOKEN = setCTOKEN;

function setCTOKEN(key) {
  const ctx = this;

  // 主动设置一个 ctoken
  const ctoken = utility.randomString(20) + ctx.app.name;
  const opts = {
    domain: utils.getCookieDomain(ctx.hostname),
    signed: false,
    httpOnly: false,
  };

  // localhost下不设置domain字段
  // @see http://stackoverflow.com/questions/8134384/chrome-doesnt-create-cookie-for-domain-localhost-in-broken-https
  if (/^\.?localhost/.test(opts.domain)) {
    delete opts.domain;
  }
  ctx.setCookie(key, ctoken, opts);
}
