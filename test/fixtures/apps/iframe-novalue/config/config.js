'use strict';

exports.security = {
  defaultMiddleware: 'xframe',
  xframe: {
    value: undefined,
    ignore: ['/hello', '/world/:id'],
  },
};
