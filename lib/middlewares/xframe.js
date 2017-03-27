'use strict';

const utils = require('../utils');

module.exports = options => {
  return function* xframe(next) {
    yield next;

    const opts = utils.merge(options, this.securityOptions.xframe);
    if (utils.checkIfIgnore(opts, this)) return;

    // DENY,SAMEORIGIN,ALLOW-FROM
    // https://developer.mozilla.org/en-US/docs/HTTP/X-Frame-Options?redirectlocale=en-US&redirectslug=The_X-FRAME-OPTIONS_response_header
    const value = opts.value || 'SAMEORIGIN';

    this.set('x-frame-options', value);
  };
};
