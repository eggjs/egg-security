'use strict';

exports.security = {
  defaultMiddleware: 'xframe',
  xframe: {
    ignore: ['/hello', '/world/:id'],
  },
};
