'use strict';

const compose = require('koa-compose');
const path = require('path');
const assert = require('assert');
const pathToReg = require('../../lib/utils').pathToReg;

module.exports = (_, app) => {
  const options = app.config.security;
  const middlewares = [];
  const defaultMiddleware = (options.defaultMiddleware || '').split(',');

  if (options.match || options.ignore) {
    app.coreLogger.warn('[egg-security] Please set `match` or `ignore` on sub config');
  }

  defaultMiddleware.forEach(middlewareName => {
    middlewareName = middlewareName.trim();

    const opt = options[middlewareName];
    assert(opt === false || typeof opt === 'object',
      `config.security.${middlewareName} must be an object, or false(if you turn it off)`);

    if (opt === false || opt && opt.enable === false) {
      return;
    }

    // 1. 检查是否有match配置
    // 如果中间件自己没有配置，则使用全局的match配置
    opt.match = pathToReg(opt.match);

    // 2. 检查是否有ignore配置
    // 如果中间件自己没有配置，则使用全局的ignore配置
    if (!opt.ignore && opt.blackUrls) {
      app.deprecate('[egg-security] Please use `config.security.xframe.ignore` instead, `config.security.xframe.blackUrls` will be removed very soon');
      opt.ignore = opt.blackUrls;
    }
    opt.ignore = pathToReg(opt.ignore);

    const fn = require(path.join(__dirname, '../../lib/middlewares', middlewareName))(opt, app);
    middlewares.push(fn);
    app.coreLogger.info('[egg-security] use %s middleware', middlewareName);
  });
  app.coreLogger.info('[egg-security] compose %d middlewares into one security middleware',
    middlewares.length);

  return compose(middlewares);
};
