'use strict';

exports.security = {
  defaultMiddleware: 'csp',
  match: /\/(?:match|ignore)/,
  csp: {
    enable: true
  }
};
