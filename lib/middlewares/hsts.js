'use strict';

const utils = require('../utils');

// Strict-Transport-Security 头信息当通过HTTP请求传递，会被浏览器忽略；
// 这是因为攻击者可能拦截或者篡改HTTP连接头。当你的网站通过HTTPS连接并且没有证书错误，浏览器知道你的网站能够支持HTTPS，并且接受Strict-Transport-Security头信息.

// expiretime 浏览器需要记住这个网站只能通过HTTPS访问的时间。
module.exports = options => {
  return function* hsts(next) {
    yield next;

    const opts = utils.merge(options, this.securityOptions.hsts);
    if (utils.checkIfIgnore(opts, this)) return;

    let val = 'max-age=' + opts.maxAge;
    // 如果这个可选的参数定义了，这条规则对于网站的所有子域同样生效。
    if (opts.includeSubdomains) {
      val += '; includeSubdomains';
    }
    this.set('strict-transport-security', val);
  };
};
