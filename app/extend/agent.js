'use strict';

module.exports = {
  /**
   * safe curl with ssrf protect
   * @param {String} url request url
   * @param {Object} options request options
   * @return {Promise} response
   */
  safeCurl(url, options = {}) {
    if (this.config.security.ssrf && this.config.security.ssrf.checkAddress) {
      options.checkAddress = this.config.security.ssrf.checkAddress;
    } else {
      this.logger.warn('[egg-security] please configure `config.security.ssrf` first');
    }

    return this.curl(url, options);
  },
};
