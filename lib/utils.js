'use strict';

const normalize = require('path').normalize;

exports.isSafeDomain = function isSafeDomain(domain, domain_white_list) {
  // add prefix `.`, because all domains in white list are start with `.`
  const hostname = '.' + domain;
  return domain_white_list.some(function(rule) {
    return hostname.endsWith(rule);
  });
};
exports.isSafePath = function isSafePath(path, ctx) {
  path = '.' + path;
  if (path.indexOf('%') !== -1) {
    try {
      path = decodeURIComponent(path);
    } catch (e) {
      if (ctx.app.config.env === 'local' || ctx.app.config.env === 'unittest') {
        // not under production environment, output log
        ctx.coreLogger.warn('[egg-security: dta global block] : decode file path %s failed.', path);
      }
    }
  }
  const normalizePath = normalize(path);
  return !(normalizePath.startsWith('../') || normalizePath.startsWith('..\\'));
};

exports.checkIfIgnore = function checkIfIgnore(opts, ctx) {
  // check opts.enable first
  if (!opts.enable) return true;
  return !opts.matching(ctx);
};

const IP_RE = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const topDomains = {};
[ '.net.cn', '.gov.cn', '.org.cn', '.com.cn' ].forEach(function(item) {
  topDomains[item] = 2 - item.split('.').length;
});

exports.getCookieDomain = function getCookieDomain(hostname) {
  if (IP_RE.test(hostname)) {
    return hostname;
  }
  // app.test.domain.com => .test.domain.com
  // app.stable.domain.com => .domain.com
  // app.domain.com => .domain.com
  // domain=.domain.com;
  const splits = hostname.split('.');
  let index = -2;

  // only when `*.test.*.com` set `.test.*.com`
  if (splits.length >= 4 && splits[splits.length - 3] === 'test') {
    index = -3;
  }
  let domain = getDomain(splits, index);
  if (topDomains[domain]) {
    domain = getDomain(splits, index + topDomains[domain]);
  }
  return domain;
};

function getDomain(arr, index) {
  return '.' + arr.slice(index).join('.');
}

exports.merge = function merge(origin, opts) {
  if (!opts) return origin;
  const res = {};

  const originKeys = Object.keys(origin);
  for (let i = 0; i < originKeys.length; i++) {
    const key = originKeys[i];
    res[key] = origin[key];
  }

  const keys = Object.keys(opts);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    res[key] = opts[key];
  }
  return res;
};
