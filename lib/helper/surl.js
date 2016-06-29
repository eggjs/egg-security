'use strict';

const escapeMap = {
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;',
  '\'': '&#x27;',
};

// protocol white list
// 增加请先通知 @常静
const protocols = {
  http: true,
  https: true,
  file: true,
  data: true,
};

module.exports = function(val) {
  if (typeof val !== 'string') return val;

  // 支持绝对路径，不支持相对路径
  if (val && val[0] !== '/') {
    // 需要根据协议进行白名单过滤
    const arr = val.split('://', 2);
    const protocol = arr.length > 1 ? arr[0] : '';
    if (!protocol || !protocols[protocol]) {
      if (process.env.NODE_ENV !== 'production') {
        // 非服务器环境，输出警告日志
        this.ctx.coreLogger.warn('[@ali/egg-security:surl] url: %j, protocol: %j, ' +
          'protocol is empty or not in white list, convert to empty string', val, protocol);
      }
      val = '';
    }
  }

  return val.replace(/["'<>]/g, function(ch) {
    return escapeMap[ch];
  });
};
