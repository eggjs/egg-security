'use strict';

const urlparse = require('url').parse;
const delegate = require('delegates');

module.exports = app => {

  /**
   * 不安全的跳转，跳转过程中不检查目标 url 是否安全。
   * 非特殊情况下，请不要随意使用此接口，否则可能会出现安全漏洞。
   *
   * @method Response#unsafeRedirect
   * @param {String} url 需要跳转的地址
   * @example
   * ```js
   * this.response.unsafeRedirect('http://www.domain.com');
   * this.unsafeRedirect('http://www.domain.com');
   * ```
   */
  app.response.unsafeRedirect = app.response.redirect;
  delegate(app.context, 'response').method('unsafeRedirect');
  /*eslint-disable */
  /**
   * 安全的跳转，跳转过程中检查目标 url 是否在安全域之中。
   * 覆盖默认的 Koa 实现，加入了白名单域名过滤。
   *
   * @method Response#redirect
   * @param {String} url 需要跳转的地址
   * @example
   * ```js
   * this.response.redirect('/login');
   * this.redirect('/login');
   * ```
   */
  /* eslint-enable */
  app.response.redirect = function redirect(url, alt) {
    url = (url || '/').trim();

    // 处理 // 情况
    if (url[0] === '/' && url[1] === '/') {
      url = '/';
    }

    // 如果以 / 开头，说明系统内跳转
    if (url[0] === '/' && url[1] !== '\\') {
      return this.unsafeRedirect(url, alt);
    }

    const info = urlparse(url);
    // use info.href instead of url
    // ensure illegal hosts are formatted
    // https://foo.bar%0a.com => https://foo.bar/%0a.com
    url = info.href;

    const domainWhiteList = this.app.config.security.domainWhiteList;
    if (info.protocol !== 'http:' && info.protocol !== 'https:') {
      url = '/';
    } else if (!info.hostname) {
      url = '/';
    } else {
      if (domainWhiteList && domainWhiteList.length !== 0) {
        if (!this.ctx.isSafeDomain(info.hostname)) {
          const message = `a security problem has been detected for url "${url}", redirection is prohibited.`;
          if (process.env.NODE_ENV === 'production') {
            this.ctx.coreLogger.warn('[egg-security:redirect] %s', message);
            url = '/';
          } else {
            // 非生产环境，直接抛异常提示
            return this.ctx.throw(500, message);
          }
        }
      }
    }
    this.unsafeRedirect(url);
  };
};
