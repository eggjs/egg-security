'use strict';

exports.security = {
  defaultMiddleware: 'xframe',
  xframe: {
    value: 'ALLOW-FROM http://www.domain.com',
    ignore: ['/hello', '/world/:id'],
  },
};
