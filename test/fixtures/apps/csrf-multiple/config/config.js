'use strict';

exports.security = {

  /**
   * 禁用methodnoallow，对OPTIONS放行
   */
  methodnoallow: {
    enable: false
  },

  csrf: {
    ignore: /^\/api\//,
    queryName: ['_csrf', '_csgo'],
    bodyName: ['_csrf', '_csgo']
  }
};
