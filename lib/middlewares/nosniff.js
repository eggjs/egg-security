'use strict';

const utils = require('../utils');

module.exports = options => {
  return async function nosniff(ctx, next) {
    await next();

    const opts = utils.merge(options, ctx.securityOptions.nosniff);
    if (utils.checkIfIgnore(opts, ctx)) return;

    ctx.set('x-content-type-options', 'nosniff');
  };
};
