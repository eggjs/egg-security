'use strict';

const utils = require('../utils');

module.exports = function(options) {
  return function* (next) {
    yield next;

    const opts = utils.merge(options, this.securityOptions.xssProtection);
    if (utils.checkIfIgnore(opts, this.path)) return;

    this.set('X-XSS-Protection', opts.value);
  };

};
