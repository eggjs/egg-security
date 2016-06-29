'use strict';

const debug = require('debug')('egg-security:ctoken');
const utils = require('../utils');

module.exports = function(options) {
  return function* ctoken(next) {
    // 必须先执行，以便下发 token
    if (!this.ctoken) {
      if (this.setCTOKEN() === false) {
        return yield next;
      }
    }

    if (!this.isAjax) {
      return yield next;
    }

    if (utils.checkIfIgnore(options, this.path)) {
      return yield next;
    }

    try {
      this.assertCTOKEN();
    } catch (err) {
      if (err.status === 403) {
        debug('%s %s, error: %s', this.method, this.url, err.message);
        this.logger.warn(err);
        this.status = 403;
        this.body = {
          message: err.message || 'invalid ctoken',
        };
      } else {
        debug('%s %s, error: %s', this.method, this.url, err.message);
        this.throw(err);
      }
      return undefined;
    }

    yield next;
  };
};
