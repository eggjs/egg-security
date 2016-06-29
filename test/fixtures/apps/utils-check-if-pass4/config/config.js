'use strict';

exports.security = {
  defaultMiddleware: 'csp',
  ignore: '/ignore',
  csp: {
    ignore: '/myignore',
    enable: true
  }
};
