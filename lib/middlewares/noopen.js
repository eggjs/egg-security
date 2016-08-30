'use strict';

const utils = require('../utils');

// @see http://blogs.msdn.com/b/ieinternals/archive/2009/06/30/internet-explorer-custom-http-headers.aspx
module.exports = function ienoopen(options) {
  return function* (next) {
    yield next;

    const opts = utils.merge(options, this.securityOptions.noopen);
    if (utils.checkIfIgnore(opts, this.path)) return;

    this.set('x-download-options', 'noopen');
  };
};
