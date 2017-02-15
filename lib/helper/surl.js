'use strict';

const escapeMap = {
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;',
  '\'': '&#x27;',
};

// protocol white list
const protocols = new Set();

protocols.add('http');
protocols.add('https');
protocols.add('file');
protocols.add('data');

module.exports = function surl(val) {

  const protocolWhiteList = this.app.config.security.protocolWhiteList;

  if (protocolWhiteList && protocolWhiteList.length !== 0) {
    protocolWhiteList.forEach(protocal => {
      protocols.add(protocal);
    });
  }

  if (typeof val !== 'string') return val;

  // only test on absolute path
  if (val && val[0] !== '/') {
    const arr = val.split('://', 2);
    const protocol = arr.length > 1 ? arr[0] : '';
    if (!protocol || !protocols.has(protocol)) {
      if (this.app.config.env === 'local') {
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
