'use strict';

exports.security = {
  defaultMiddleware: 'csp',
  match: /\/(?:match|ignore)/,
  ignore: /\/(?:ignore|luckydrq)/,
  csp: {
    enable: true
  }
};
