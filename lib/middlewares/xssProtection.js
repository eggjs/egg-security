'use strict';

const utils = require('../utils');

module.exports = options => {
  return function* xssProtection(next) {
    yield next;

    const opts = utils.merge(options, this.securityOptions.xssProtection);
    if (utils.checkIfIgnore(opts, this)) return;

    this.set('x-xss-protection', opts.value);
  };
};
