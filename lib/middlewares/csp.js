'use strict';

const extend = require('extend');
const platform = require('platform');
const utils = require('../utils');
const HEADER = [
  'X-Content-Security-Policy',
  'Content-Security-Policy',
];

module.exports = function csp(options) {
  return function* (next) {
    yield next;

    const opts = utils.merge(options, this.securityOptions.csp);
    if (utils.checkIfIgnore(opts, this.path)) return;

    const reportOnly = opts.reportOnly;
    const supportIE = opts.supportIE;

    let finalHeader;
    let value;
    const matchedOption = extend(true, {}, opts.policy);
    const ctx = this;
    const isIE = platform.parse(ctx.header['user-agent']).name === 'IE';
    const bufArray = [];

    if (isIE && supportIE) {
      finalHeader = HEADER[0];
    } else {
      finalHeader = HEADER[1];
    }

    if (reportOnly) {
      finalHeader += '-Report-Only';
    }

    for (const key in matchedOption) {

      value = matchedOption[key];
      value = Array.isArray(value) ? value : [ value ];

      // sandbox 单独处理，其他数组拆开为字符串
      if (key === 'sandbox' && value[0] === true) {
        bufArray.push(key);
      } else {
        if (key === 'script-src') {
          const hasNonce = value.some(function(val) {
            return val.indexOf('nonce-') !== -1;
          });

          if (!hasNonce) {
            value.push('\'nonce-' + ctx.nonce + '\'');
          }
        }

        value = value.map(function(d) {
          // 统一白名单格式为.开头
          if (d.startsWith('.')) {
            d = '*' + d;
          }
          return d;
        });
        bufArray.push(key + ' ' + value.join(' '));
      }
    }
    const headerString = bufArray.join(';');
    ctx.set(finalHeader, headerString);
    // 通过设置X-CSP-Nonce，可以让tengine获取到nonce，从而可以支持一些只有tengine吐出来的脚本的nonce支持
    ctx.set('X-CSP-Nonce', ctx.nonce);

    yield next;
  };
};
