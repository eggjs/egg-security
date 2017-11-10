'use strict';

const utils = require('../utils');

// Set Strict-Transport-Security header
module.exports = options => {
  return async function hsts(ctx, next) {
    await next();

    const opts = utils.merge(options, ctx.securityOptions.hsts);
    if (utils.checkIfIgnore(opts, ctx)) return;

    let val = 'max-age=' + opts.maxAge;
    // 如果这个可选的参数定义了，这条规则对于网站的所有子域同样生效。
    if (opts.includeSubdomains) {
      val += '; includeSubdomains';
    }
    ctx.set('strict-transport-security', val);
  };
};
