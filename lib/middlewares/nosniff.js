'use strict';

const statuses = require('statuses');
const utils = require('../utils');

module.exports = options => {
  return function* nosniff(next) {
    yield next;

    // ignore redirect response
    if (statuses.redirect[this.status]) return;

    const opts = utils.merge(options, this.securityOptions.nosniff);
    if (utils.checkIfIgnore(opts, this)) return;

    this.set('x-content-type-options', 'nosniff');
  };
};
