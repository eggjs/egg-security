'use strict';

/**
 * File Inclusion
 */

function pathFilter(path) {

  if (typeof path !== 'string') return path;

  const pathSource = path;

  while (path.indexOf('%') !== -1) {
    try {
      path = decodeURIComponent(path);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        // 非服务器环境，输出警告日志
        this.ctx.coreLogger.warn('[egg-security:helper:spath] : decode file path %s failed.', path);
      }
      break;
    }
  }
  if (path.indexOf('..') !== -1 || path[0] === '/') {
    return null;
  }
  return pathSource;
}

module.exports = pathFilter;
