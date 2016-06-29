'use strict';

exports.security = {
  defaultMiddleware: 'csp',
  match: /\/match/,
  ignore: /\/ignore/,
  csp: {
    match: /\/(?:mymatch|myignore)/,
    ignore: /\/(?:myignore|mytrueignore)/,
    enable: true
  }
};
