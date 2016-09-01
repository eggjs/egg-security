'use strict';

const pathToRegexp = require('path-to-regexp');

exports.isSafeDomain = function isSafeDomain(domain, domain_white_list) {
  // 在最前面加一个 . 字符串，因为白名单列表里面都是以 . 开始的
  const hostname = '.' + domain;
  return domain_white_list.some(function(rule) {
    return hostname.endsWith(rule);
  });
};

exports.pathToReg = function pathToReg(strPath) {
  if (Array.isArray(strPath)) {
    return strPath.map(function(str) {
      return exports.pathToReg(str);
    });
  }

  if (strPath && typeof strPath === 'string') {
    strPath = pathToRegexp(strPath, [], {
      end: false,
    });
  }
  return strPath;
};

exports.checkIfIgnore = function checkIfIgnore(opts, path) {
  // 先检查 enable
  if (!opts.enable) return true;

  // 优先使用match
  if (opts.match) {
    if (Array.isArray(opts.match)) {
      return !opts.match.some(function(match) {
        return match.test(path);
      });
    }
    return !opts.match.test(path);
  }

  // 再看看是否配置了ignore
  if (opts.ignore) {
    if (Array.isArray(opts.ignore)) {
      return opts.ignore.some(function(ignore) {
        return ignore.test(path);
      });
    }
    return opts.ignore.test(path);
  }

  // 啥也没配，就会进入中间件
  return false;
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

  // 只有 *.test.*.com 才设置 .test.*.com
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
