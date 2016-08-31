'use strict';

exports.security = {
  defaultMiddleware: 'hsts',
  hsts: {
  	enable: true,
    includeSubdomains: true
  },
};
