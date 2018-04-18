'use strict';

const defaultPreventMethods = {
  TRACE: true,
  TRACK: true,
  OPTIONS: true,
};

// https://www.owasp.org/index.php/Cross_Site_Tracing
// http://jsperf.com/find-by-map-with-find-by-array
module.exports = options => {
  options = Object.assign({}, options);
  return function notAllow(ctx, next) {
    const preventMethods = options.preventMethods ? Object.assign({},
      defaultPreventMethods, options.preventMethods) : defaultPreventMethods;
    // ctx.method is upper case
    if (preventMethods[ctx.method]) {
      ctx.throw(405);
    }
    return next();
  };
};
