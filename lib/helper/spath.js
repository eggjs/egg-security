'use strict';

/**
 * 用于文件包含（File Inclusion）漏洞的防范
 * 如果对用户输入的path不信任，可以使用this.helper.spath(path)安全输出path，不安全的path会返回null。
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
