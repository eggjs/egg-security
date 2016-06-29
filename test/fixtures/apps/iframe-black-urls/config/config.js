'use strict';

exports.security = {
  defaultMiddleware: 'xframe',
  xframe: {
    blackUrls: ['/hello', '/world/:id'],
  },
};
