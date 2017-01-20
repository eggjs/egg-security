'use strict';

module.exports = () => {

  const exports = {};

  /**
   * security options
   * @member Config#security
   * @property {String} defaultMiddleware - 默认开启的安全中间件。
   * @property {Object} csrf - 防止跨站请求伪造攻击。
   * @property {Object} xframe - 是否启用 X-Frame-Options 响应头，默认为 SAMEORIGIN
   * @property {Object} hsts - 是否启用 Strict-Transport-Security 响应头，默认一年
   * @property {Object} methodnoallow - 是否启用Http Method过滤。
   * @property {Object} noopen - 禁用IE下下载框Open按钮。
   * @property {Object} nosniff - 禁用IE8自动嗅探mime功能。
   * @property {Object} xssProtection - 是否开启IE8的XSS Filter，默认开启。
   * @property {Object} csp - csp安全配置。
   * @property {Array} domainWhiteList - 安全跳转白名单
   */
  exports.security = {
    domainWhiteList: [],
    defaultMiddleware: 'csrf,hsts,methodnoallow,noopen,nosniff,csp,xssProtection,xframe',

    csrf: {
      enable: true,
      cookieName: 'csrfToken',
      sessionName: 'csrfToken',
      headerName: 'x-csrf-token',
      bodyName: '_csrf',
    },

    xframe: {
      enable: true,
      // 'SAMEORIGIN', 'DENY' or 'ALLOW-FROM http://example.jp'
      value: 'SAMEORIGIN',
    },

    hsts: {
      enable: false,
      maxAge: 365 * 24 * 3600,
      includeSubdomains: false,
    },

    methodnoallow: {
      enable: true,
    },

    noopen: {
      enable: true,
    },

    nosniff: {
      enable: true,
    },

    xssProtection: {
      enable: true,
      value: '1; mode=block',
    },

    csp: {
      enable: false,
      policy: {},
    },
  };

  exports.helper = {
    shtml: {
      domainWhiteList: [],
    },
  };

  return exports;
};
