'use strict';

const INPUT_CSRF = '\r\n<input type="hidden" name="_csrf" value="{{ctx.csrf}}" /></form>';

exports.injectCsrf = function injectCsrf(tmplStr) {
  tmplStr = tmplStr.replace(/(<form.*?>)([\s\S]*?)<\/form>/gi, function replaceCsrf(_, $1, $2) {
    const match = $2;
    if (match.indexOf('name="_csrf"') !== -1 || match.indexOf('name=\'_csrf\'') !== -1) {
      return $1 + match + '</form>';
    }
    return $1 + match + INPUT_CSRF;
  });

  return tmplStr;
};

exports.injectNonce = function injectNonce(tmplStr) {
  tmplStr = tmplStr.replace(/<script(.*?)>([\s\S]*?)<\/script>/gi, function replaceNonce(_, $1, $2) {
    if ($1.indexOf('nonce=') === -1) {
      $1 += ' nonce="{{ctx.nonce}}"';
    }

    return '<script' + $1 + '>' + $2 + '</script>';
  });
  return tmplStr;
};

const INJECTION_DEFENSE = '<!--for injection--><!--</html>--><!--for injection-->';

exports.injectHijackingDefense = function injectHijackingDefense(tmplStr) {
  return INJECTION_DEFENSE + tmplStr + INJECTION_DEFENSE;
};

/**
 * safe curl with ssrf protect
 * @param {String} url request url
 * @param {Object} options request options
 * @return {Promise} response
 */
exports.safeCurl = function safeCurl(url, options = {}) {
  if (this.config.security.ssrf && this.config.security.ssrf.checkAddress) {
    options.checkAddress = this.config.security.ssrf.checkAddress;
  } else {
    this.logger.warn('[egg-security] please configure `config.security.ssrf` first');
  }

  return this.curl(url, options);
};
