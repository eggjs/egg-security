module.exports = (options, app) => {
  return async function(next) {
    delete this.response.header['Strict-Transport-Security'];
    delete this.response.header['X-Download-Options'];
    delete this.response.header['X-Content-Type-Options'];
    delete this.response.header['X-XSS-Protection'];
    await next;
    delete this.response.header['Strict-Transport-Security'];
    delete this.response.header['X-Download-Options'];
    delete this.response.header['X-Content-Type-Options'];
    delete this.response.header['X-XSS-Protection'];
  };
};
