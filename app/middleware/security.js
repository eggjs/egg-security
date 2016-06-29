'use strict';

const compose = require('koa-compose');
const path = require('path');
const pathToReg = require('../../lib/utils').pathToReg;
const assert = require('assert');

module.exports = function security(options, app) {
  const middlewares = [ securityOptions ];
  const defaultMiddleware = (options.defaultMiddleware || '').split(',');

  if (options.match || options.ignore) {
    app.loggers.coreLogger.warn('[egg:security] 请在子项设置 match 或 ignore');
  }

  defaultMiddleware.forEach(function(middlewareName) {
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
      app.deprecate('[egg:plugin:egg-security] Please use `config.security.xframe.ignore` instead, `config.security.xframe.blackUrls` will be removed very soon');
      opt.ignore = opt.blackUrls;
    }
    opt.ignore = pathToReg(opt.ignore);

    const fn = require(path.join(__dirname, '../../lib/middlewares', middlewareName))(opt, app);
    middlewares.push(fn);
  });

  return compose(middlewares);
};

function* securityOptions(next) {
  this.securityOptions = {};
  return yield next;
}
