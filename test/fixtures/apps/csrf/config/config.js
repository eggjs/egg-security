'use strict';

exports.security = {

  /**
   * 禁用methodnoallow，对OPTIONS放行
   */
  methodnoallow: {
    enable: false
  },

  ctoken: {
    enable: false,
  },

  csrf: {
    ignore: /^\/api\//,
  }
};
