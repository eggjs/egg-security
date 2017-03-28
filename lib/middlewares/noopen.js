'use strict';

const utils = require('../utils');

// @see http://blogs.msdn.com/b/ieinternals/archive/2009/06/30/internet-explorer-custom-http-headers.aspx
module.exports = options => {
  return function* noopen(next) {
    yield next;

    const opts = utils.merge(options, this.securityOptions.noopen);
    if (utils.checkIfIgnore(opts, this)) return;

    this.set('x-download-options', 'noopen');
  };
};
