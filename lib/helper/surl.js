'use strict';

const escapeMap = {
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;',
  '\'': '&#x27;',
};

// protocol white list
const protocols = {
  http: true,
  https: true,
  file: true,
  data: true,
};

module.exports = function surl(val) {
  if (typeof val !== 'string') return val;

  // only test on absolute path
  if (val && val[0] !== '/') {
    const arr = val.split('://', 2);
    const protocol = arr.length > 1 ? arr[0] : '';
    if (!protocol || !protocols[protocol]) {
      if (process.env.NODE_ENV !== 'production') {
        this.ctx.coreLogger.warn('[egg-security:surl] url: %j, protocol: %j, ' +
          'protocol is empty or not in white list, convert to empty string', val, protocol);
      }
      val = '';
    }
  }

  return val.replace(/["'<>]/g, function(ch) {
    return escapeMap[ch];
  });
};
