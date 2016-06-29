'use strict';

const urlparse = require('url').parse;
const isSafeDomainDefault = require('../utils').isSafeDomain;
const xss = require('xss');
const BUILD_IN_ON_TAG_ATTR = Symbol('buildInOnTagAttr');
const utils = require('../utils');

// 是否在用户自定义拓展的白名单中
function isSafeDomainCustom(whitelist, domain) {
  // 在最前面加一个 . 字符串，因为白名单列表里面都是以 . 开始的
  const hostname = '.' + domain;
  return whitelist.some(function(rule) {
    return hostname.endsWith(rule);
  });
}


// 默认规则：https://github.com/leizongmin/js-xss/blob/master/lib/default.js
// 在 xss 模块基础上增加了针对域名的过滤
// 自定义过滤项 http://jsxss.com/zh/options.html
// 例如只支持 a 标签，且除了 title 其他属性都过滤掉： whiteList: {a: ['title']}
// 增加 domainWhiteList 选项，拓展 href 和 src 域名过滤白名单。
module.exports = function shtml(val) {
  if (typeof val !== 'string') return val;

  const securityOptions = this.ctx.securityOptions || {};
  const shtmlConfig = utils.merge(this.app.config.helper.shtml, securityOptions.shtml);
  const domainWhiteList = this.app.config.security.domainWhiteList;

  // 过滤 href 和 src 属性，如果不在白名单则过滤掉
  if (!shtmlConfig[BUILD_IN_ON_TAG_ATTR]) {
    shtmlConfig[BUILD_IN_ON_TAG_ATTR] = function(tag, name, value, isWhiteAttr) {
      if (isWhiteAttr && (name === 'href' || name === 'src')) {
        if (!value) {
          return;
        }

        value = String(value);

        if (value[0] === '/') {
          return;
        }

        const hostname = urlparse(value).hostname;
        // 既不在内置白名单，也不再 config.helper.shtml.domainWhiteList 中，则过滤掉
        if (!isSafeDomainDefault(hostname, domainWhiteList) && !isSafeDomainCustom(shtmlConfig.domainWhiteList, hostname)) {
          /*eslint-disable */
          return '';
          /*eslint-enable */
        }
      }
    };

    // 防止覆盖用户定义的 onTagAttr，所以要做不同的处理
    if (shtmlConfig.onTagAttr) {
      const original = shtmlConfig.onTagAttr;
      shtmlConfig.onTagAttr = function() {
        const result = original.apply(this, arguments);
        if (result !== undefined) {
          return result;
        }
        return shtmlConfig[BUILD_IN_ON_TAG_ATTR].apply(this, arguments);

      };
    } else {
      shtmlConfig.onTagAttr = shtmlConfig[BUILD_IN_ON_TAG_ATTR];
    }
  }

  return xss(val, shtmlConfig);
};
