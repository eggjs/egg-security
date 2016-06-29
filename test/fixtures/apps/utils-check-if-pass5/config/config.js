'use strict';

exports.security = {
  defaultMiddleware: 'xframe',
  xframe: {
    ignore: ['/ignore1', '/ignore2'],
    enable: true
  }
};
