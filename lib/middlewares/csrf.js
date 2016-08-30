'use strict';

const debug = require('debug')('egg-security:csrf');
const utils = require('../utils');

module.exports = options => {
  return function* csrf(next) {
    // ignore requests: get, head, options
    const method = this.method;
    if (method === 'GET' ||
      method === 'HEAD' ||
      method === 'OPTIONS') {
      return yield next;
    }

    if (utils.checkIfIgnore(options, this.path)) {
      return yield next;
    }

    const body = this.request.body || {};
    debug('%s %s, got %j', this.method, this.url, body);

    try {
      this.assertCSRF(body);
    } catch (err) {
      debug('%s %s, error: %s', this.method, this.url, err.message);
      if (err.status !== 403) this.throw(err);

      this.status = 403;
      const message = err.message || 'invalid csrf token';
      if (message === 'token is missing' && this.app.config.env === 'local') {
        const err = new Error('csrf token is missing when post');
        this.logger.error(err);
      } else {
        this.logger.warn(err);
      }
      this.body = this.accepts('html', 'text', 'json') === 'json'
        ? { message }
        : message;
      return;
    }

    yield next;
  };
};
