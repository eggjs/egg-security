'use strict';

const debug = require('debug')('egg-security:csrf');
const typeis = require('type-is');
const utils = require('../utils');

module.exports = options => {
  return function* csrf(next) {
    if (utils.checkIfIgnore(options, this)) {
      return yield next;
    }

    // ensure csrf token exists
    if (utils.checkCsrfType(options.type).shouldCheckCtoken) {
      this.ensureCsrfSecret();
    }

    // ignore requests: get, head, options and trace
    const method = this.method;
    if (method === 'GET' ||
      method === 'HEAD' ||
      method === 'OPTIONS' ||
      method === 'TRACE') {
      return yield next;
    }

    if (options.ignoreJSON && typeis.is(this.get('content-type'), 'json')) {
      return yield next;
    }

    const body = this.request.body || {};
    debug('%s %s, got %j', this.method, this.url, body);
    this.assertCsrf();
    yield next;
  };
};
