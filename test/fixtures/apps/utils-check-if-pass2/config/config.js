'use strict';

exports.security = {
  defaultMiddleware: 'csp',
  match: /\/match/,
  csp: {
    match: /\/(?:mymatch|myignore)/,
    enable: true
  }
};
